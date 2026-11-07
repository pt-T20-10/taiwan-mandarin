$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$adb = "$projectRoot/runtime/android-toolchain/sdk/platform-tools/adb.exe"
if (!(Test-Path $adb)) { throw 'Run scripts/Setup-Android.ps1 first.' }
& $adb devices
$device = & $adb get-state 2>$null
if ($device -ne 'device') { throw 'Connect one Android phone by USB, enable USB debugging and approve this PC on the phone.' }
& $adb install -r "$projectRoot/data/android-build/dao-nho-review.apk"
if ($LASTEXITCODE) { throw 'APK installation failed.' }
& $adb shell am start -n app.daonho.review/.MainActivity
