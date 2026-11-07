$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$projectRoot = Split-Path $PSScriptRoot -Parent
$toolRoot = Join-Path $projectRoot 'runtime/android-toolchain'
New-Item -ItemType Directory -Force -Path $toolRoot | Out-Null
function Fetch($url, $destination) {
    if (!(Test-Path -LiteralPath $destination)) { Write-Host "Downloading $destination"; Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $destination }
}
if (!(Test-Path "$toolRoot/jdk/bin/java.exe")) {
    Fetch 'https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse' "$toolRoot/jdk.zip"
    Expand-Archive -LiteralPath "$toolRoot/jdk.zip" -DestinationPath "$toolRoot/jdk-unpack" -Force
    $jdkFolder = Get-ChildItem "$toolRoot/jdk-unpack" -Directory | Select-Object -First 1
    Move-Item -LiteralPath $jdkFolder.FullName -Destination "$toolRoot/jdk"
}
$env:JAVA_HOME = "$toolRoot/jdk"
$env:ANDROID_HOME = "$toolRoot/sdk"
$env:PATH = "$env:JAVA_HOME/bin;$env:ANDROID_HOME/platform-tools;$env:PATH"
if (!(Test-Path "$env:ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager.bat")) {
    Fetch 'https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip' "$toolRoot/cmdline-tools.zip"
    Expand-Archive -LiteralPath "$toolRoot/cmdline-tools.zip" -DestinationPath "$toolRoot/cli-unpack" -Force
    New-Item -ItemType Directory -Force -Path "$env:ANDROID_HOME/cmdline-tools" | Out-Null
    Move-Item -LiteralPath "$toolRoot/cli-unpack/cmdline-tools" -Destination "$env:ANDROID_HOME/cmdline-tools/latest"
}
# Invoke the Java CLI directly: the Windows sdkmanager.bat wrapper can consume
# redirected stdin while checking java -version, losing license responses.
& "$projectRoot/.venv/Scripts/python.exe" "$PSScriptRoot/install_android_sdk.py" $env:JAVA_HOME $env:ANDROID_HOME
if ($LASTEXITCODE -ne 0) { throw 'Android SDK installation failed.' }
if (!(Test-Path "$env:ANDROID_HOME/platforms/android-36/android.jar") -or !(Test-Path "$env:ANDROID_HOME/platform-tools/adb.exe")) { throw 'SDK packages are missing. Rerun setup and check license acceptance.' }
Write-Host 'Android CLI tools ready. No Android Studio or global PATH changes.'
