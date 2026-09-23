@echo off
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  echo Khong tim thay .venv\Scripts\python.exe. Xem README.md.
  pause
  exit /b 1
)
".venv\Scripts\python.exe" -m backend.launcher
if errorlevel 1 pause
