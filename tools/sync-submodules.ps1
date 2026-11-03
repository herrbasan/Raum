#Requires -Version 5.1
<#
.SYNOPSIS
    Move every submodule onto the tip of its declared upstream branch.

.DESCRIPTION
    For each submodule in .gitmodules: refuse a dirty checkout, re-attach the
    branch if HEAD is detached, fetch, then `merge --ff-only origin/<branch>`.

    Never `git submodule update --remote`: that detaches HEAD, and a detached
    submodule is invisible to the ahead/behind indicator - the drift then rots
    silently until someone diffs against upstream by hand.

    The submodule pin is a real commit in this repo. A local refresh that is not
    committed never reaches CI (deploy-pages.yml checks out the pinned SHA), so
    the script prints the bump commands, or performs them with -Commit.

.PARAMETER Name
    Sync only the submodule whose .gitmodules name matches (e.g. modules/nui_wc2).

.PARAMETER NoFetch
    Skip the fetch. Only useful offline, and only when origin/<branch> is
    already current locally - the merge still refuses anything non-fast-forward.

.PARAMETER Commit
    Stage each moved submodule path and commit it as its own commit.

.EXAMPLE
    tools\sync-submodules.ps1
.EXAMPLE
    tools\sync-submodules.ps1 -Commit
#>
[CmdletBinding()]
param(
    [string]$Name,
    [switch]$NoFetch,
    [switch]$Commit
)

$ErrorActionPreference = 'Stop'

function Invoke-Git {
    param([string]$GitDir, [string[]]$GitArgs)
    $prefix = @()
    if ($GitDir) { $prefix = @('-C', $GitDir) }
    $out = & git @prefix @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArgs -join ' ') failed in '$GitDir' (exit $LASTEXITCODE)"
    }
    return $out
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path '.gitmodules')) { throw "No .gitmodules in $repoRoot" }

$declared = & git config -f .gitmodules --get-regexp '^submodule\..*\.path$'
if ($LASTEXITCODE -ne 0 -or -not $declared) { throw "No submodules declared in .gitmodules" }

$moved = @()

foreach ($line in @($declared)) {
    # "submodule.modules/nui_wc2.path modules/nui_wc2"
    if ($line -notmatch '^submodule\.(.+)\.path\s+(.+)$') { throw "Unparseable .gitmodules line: $line" }
    $subName = $Matches[1]
    $subPath = $Matches[2].Trim()

    if ($Name -and $subName -ne $Name) { continue }

    $branch = & git config -f .gitmodules --get "submodule.$subName.branch"
    if ($LASTEXITCODE -ne 0 -or -not $branch) {
        throw "Submodule '$subName' has no 'branch =' in .gitmodules. Add it (one line, the branch name) before syncing - a missing branch is what makes drift invisible."
    }

    Write-Host "== $subName ($subPath) -> origin/$branch"

    if (-not (Test-Path (Join-Path $subPath '.git'))) {
        Write-Host "   not initialized - running 'git submodule update --init'"
        Invoke-Git -GitArgs @('submodule', 'update', '--init', $subPath) | Out-Null
    }

    $dirty = Invoke-Git -GitDir $subPath -GitArgs @('status', '--porcelain')
    if ($dirty) {
        throw "Submodule '$subName' has local changes. Commit or discard them first - a merge onto a dirty checkout is how work gets lost.`n$($dirty -join "`n")"
    }

    $before = (Invoke-Git -GitDir $subPath -GitArgs @('rev-parse', 'HEAD')).Trim()

    $head = (Invoke-Git -GitDir $subPath -GitArgs @('rev-parse', '--abbrev-ref', 'HEAD')).Trim()
    if ($head -eq 'HEAD') {
        Write-Host "   detached HEAD - re-attaching branch '$branch'"
        Invoke-Git -GitDir $subPath -GitArgs @('checkout', $branch) | Out-Null
    }
    elseif ($head -ne $branch) {
        throw "Submodule '$subName' is on '$head', but .gitmodules declares '$branch'. Refusing to merge into a different branch."
    }

    if (-not $NoFetch) {
        Invoke-Git -GitDir $subPath -GitArgs @('fetch', '--prune', 'origin', $branch) | Out-Null
    }

    $upstream = (Invoke-Git -GitDir $subPath -GitArgs @('rev-parse', "origin/$branch")).Trim()
    if ($before -eq $upstream) {
        Write-Host "   already at origin/$branch ($($before.Substring(0, 7)))"
        continue
    }

    Invoke-Git -GitDir $subPath -GitArgs @('merge', '--ff-only', "origin/$branch") | Out-Null

    $after = (Invoke-Git -GitDir $subPath -GitArgs @('rev-parse', 'HEAD')).Trim()
    $count = (Invoke-Git -GitDir $subPath -GitArgs @('rev-list', '--count', "$before..$after")).Trim()
    Write-Host "   $($before.Substring(0, 7)) -> $($after.Substring(0, 7))  ($count commit(s))"
    $moved += [pscustomobject]@{ Name = $subName; Path = $subPath; Sha = $after; Count = $count }
}

if ($moved.Count -eq 0) {
    Write-Host "All submodules at their branch tips."
    exit 0
}

foreach ($m in $moved) {
    $message = "submodule: $($m.Name) -> $($m.Sha.Substring(0, 7))"
    if ($Commit) {
        Invoke-Git -GitArgs @('add', $m.Path) | Out-Null
        Invoke-Git -GitArgs @('commit', '-m', $message) | Out-Null
        Write-Host "committed: $message"
    }
    else {
        Write-Host ""
        Write-Host "Submodule pin moved. Commit it, or CI keeps building the old checkout:"
        Write-Host "  git add $($m.Path)"
        Write-Host "  git commit -m `"$message`""
    }
}
