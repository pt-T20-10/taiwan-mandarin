param([Parameter(Mandatory=$true)][string]$CacheRoot)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($CacheRoot).TrimEnd('\','/')
if (!(Test-Path -LiteralPath $root)) { return 0 }
$moved = 0
# Gradle 8.x Windows bug #31438: a completed transform can be left under its
# temporary name after the daemon releases it. Promote only complete metadata,
# never overwrite an existing immutable entry or change the artifact contents.
foreach ($version in Get-ChildItem -LiteralPath (Join-Path $root 'caches') -Directory) {
    $transforms = Join-Path $version.FullName 'transforms'
    if (!(Test-Path -LiteralPath $transforms)) { continue }
    foreach ($entry in Get-ChildItem -LiteralPath $transforms -Directory) {
        if ($entry.Name -notmatch '^([a-f0-9]{32})-[a-f0-9-]{36}$') { continue }
        $source = [IO.Path]::GetFullPath($entry.FullName)
        $target = [IO.Path]::GetFullPath((Join-Path $transforms $Matches[1]))
        if (!$source.StartsWith($root+'\',[StringComparison]::OrdinalIgnoreCase) -or !$target.StartsWith($root+'\',[StringComparison]::OrdinalIgnoreCase)) { throw 'Cache path escapes project cache root' }
        if ((Test-Path -LiteralPath $target) -or !(Test-Path -LiteralPath "$source/metadata.bin") -or !(Test-Path -LiteralPath "$source/results.bin") -or !(Test-Path -LiteralPath "$source/transformed")) { continue }
        try { [IO.Directory]::Move($source,$target); $moved++ } catch { Write-Host "Cache entry still locked: $($entry.Name)" }
    }
}
if ($moved) { Write-Host "Recovered $moved completed Gradle cache entries." }
return $moved
