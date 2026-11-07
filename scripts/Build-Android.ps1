$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
$env:JAVA_HOME = "$projectRoot/runtime/android-toolchain/jdk"
$env:ANDROID_HOME = "$projectRoot/runtime/android-toolchain/sdk"
$workspaceRoot = Split-Path $projectRoot -Parent
# Short cache paths avoid Windows MAX_PATH and transform-workspace rename issues.
$env:GRADLE_USER_HOME = "$workspaceRoot/.dao-nho-gradle"
$env:PATH = "$env:JAVA_HOME/bin;$env:ANDROID_HOME/platform-tools;$env:PATH"
if (!(Test-Path "$env:JAVA_HOME/bin/java.exe")) { throw 'Run scripts/Setup-Android.ps1 first.' }
& npm.cmd run build:mobile
if ($LASTEXITCODE) { throw 'Mobile web build failed.' }
& npx.cmd cap sync android
if ($LASTEXITCODE) { throw 'Capacitor sync failed.' }
$sdkProperty = $env:ANDROID_HOME.Replace('\','/').Replace(':','\:')
Set-Content -LiteralPath "$projectRoot/android/local.properties" -Value "sdk.dir=$sdkProperty" -Encoding ASCII
New-Item -ItemType Directory -Force -Path "$projectRoot/data/android-signing" | Out-Null
$keyPath = "$projectRoot/data/android-signing/review.jks"
$passwordPath = "$projectRoot/data/android-signing/password.txt"
if (!(Test-Path $keyPath)) {
    $password = [Guid]::NewGuid().ToString('N')
    Set-Content -LiteralPath $passwordPath -Value $password -NoNewline
    & "$env:JAVA_HOME/bin/keytool.exe" -genkeypair -keystore $keyPath -storepass $password -keypass $password -alias review -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=Dao Nho Personal Review'
    if ($LASTEXITCODE) { throw 'Signing key generation failed.' }
}
$env:REVIEW_KEYSTORE = $keyPath
$env:REVIEW_STORE_PASSWORD = (Get-Content -LiteralPath $passwordPath -Raw).Trim()
Push-Location android
try {
    $null = & "$PSScriptRoot/Repair-GradleCache.ps1" -CacheRoot $env:GRADLE_USER_HOME
    for ($attempt=0; $attempt -lt 3; $attempt++) {
        & "$projectRoot/.venv/Scripts/python.exe" "$PSScriptRoot/run_android_gradle.py"
        if (!$LASTEXITCODE) { break }
        $workspaceFailure = Select-String -LiteralPath "$projectRoot/data/android-build/gradle.log" -SimpleMatch 'Could not move temporary workspace' -Quiet
        if (!$workspaceFailure) { throw 'Android build failed; see data/android-build/gradle.log.' }
        Start-Sleep -Seconds 2
        $recovered = & "$PSScriptRoot/Repair-GradleCache.ps1" -CacheRoot $env:GRADLE_USER_HOME
        if ($attempt -eq 2) { throw 'Android build failed; see data/android-build/gradle.log.' }
        Write-Host 'Retrying after Windows Gradle workspace recovery.'
    }
} finally { Pop-Location }
New-Item -ItemType Directory -Force -Path "$projectRoot/data/android-build" | Out-Null
Copy-Item -LiteralPath "$projectRoot/android/app/build/outputs/apk/release/app-release.apk" -Destination "$projectRoot/data/android-build/dao-nho-review.apk"
Write-Host "APK: $projectRoot/data/android-build/dao-nho-review.apk"
