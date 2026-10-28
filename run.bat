@echo off
setlocal

echo ====================================================
echo  Ultimate Mortal Kombat 3 (Desktop Edition) - Launch
echo ====================================================

if not exist "%~dp0build\compat\DesktopLauncher.class" (
    echo [*] First run detected. Building compatibility layer...
    call "%~dp0build.bat"
    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%
)

echo [*] Starting UMK3 desktop window (Java 22)...
echo [*] Controls:
echo     - Arrow Keys    : Move / Jump / Crouch
echo     - Enter / Space : Select / Fire
echo     - Z / X         : High Punch / High Kick
echo     - C / V         : Low Punch / Low Kick
echo     - A             : Block
echo     - S             : Run
echo     - F1 / Q        : Options Menu (Softkey 1)
echo     - F2 / Esc      : Back (Softkey 2)
echo.

java -cp "%~dp0build\compat;%~dp0Ultimate_Mortal_Kombat_3_deobf.jar" DesktopLauncher %*
