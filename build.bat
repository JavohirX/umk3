@echo off
setlocal

echo ====================================================
echo  UMK3 Desktop Edition - Build Script
echo ====================================================
echo.

if not exist "%~dp0build\compat" mkdir "%~dp0build\compat"

echo Compiling all game sources and desktop runtime (src\main\java)...
dir /s /b "%~dp0src\main\java\*.java" > "%~dp0build\sources.txt"

javac -encoding UTF-8 ^
    -cp "%~dp0build\compat;%~dp0Ultimate_Mortal_Kombat_3_deobf.jar" ^
    -d "%~dp0build\compat" ^
    "@%~dp0build\sources.txt"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed. See errors above.
    exit /b %ERRORLEVEL%
)
echo    OK.

echo.
echo ====================================================
echo  Build SUCCESSFUL!  Run the game with:  run.bat
echo ====================================================
