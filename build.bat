@echo off
setlocal

echo ====================================================
echo  UMK3 Desktop Edition - Build Script
echo ====================================================
echo.

if not exist "%~dp0build\compat" mkdir "%~dp0build\compat"

REM --- Step 1: Compile the desktop launcher and compatibility bridge ---
echo [1/2] Compiling desktop launcher (src\main\java)...
javac -encoding UTF-8 -cp "%~dp0build\compat;%~dp0Ultimate_Mortal_Kombat_3_deobf.jar" ^
    -d "%~dp0build\compat" ^
    "%~dp0src\main\java\DesktopLauncher.java" ^
    "%~dp0src\main\java\GamePrintStream.java"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Launcher compilation failed.
    exit /b %ERRORLEVEL%
)
echo    OK.

REM --- Step 2: Compile human-readable game sources from src\main\java ---
echo [2/2] Compiling game sources (src\main\java)...

(for %%f in ("%~dp0src\main\java\*.java") do (
    if /I not "%%~nxf"=="DesktopLauncher.java" (
        if /I not "%%~nxf"=="GamePrintStream.java" (
            if /I not "%%~nxf"=="CoreEngine.java" echo %%f
        )
    )
)) > "%~dp0build\sources.txt"

javac -encoding UTF-8 ^
    -cp "%~dp0build\compat;%~dp0Ultimate_Mortal_Kombat_3_deobf.jar" ^
    -d "%~dp0build\compat" ^
    "@%~dp0build\sources.txt"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Game source compilation failed. See errors above.
    exit /b %ERRORLEVEL%
)
echo    OK.

echo.
echo ====================================================
echo  Build SUCCESSFUL!  Run the game with:  run.bat
echo ====================================================
