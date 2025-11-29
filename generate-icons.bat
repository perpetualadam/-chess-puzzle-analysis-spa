@echo off
echo.
echo ========================================
echo   Chess PWA Icon Generator
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python found! Attempting to generate icons...
    echo.
    python generate-icons.py
    if %errorlevel% == 0 (
        echo.
        echo Success! Icons generated.
        goto :end
    ) else (
        echo.
        echo Python script failed. Trying alternative method...
    )
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js found! Attempting to generate icons...
    echo.
    node generate-icons.js
    if %errorlevel% == 0 (
        echo.
        echo Success! Icons generated.
        goto :end
    ) else (
        echo.
        echo Node.js script failed.
    )
)

REM Fallback to browser method
echo.
echo ========================================
echo   Manual Icon Generation Required
echo ========================================
echo.
echo Neither Python nor Node.js could generate icons automatically.
echo.
echo Please use the browser-based generator:
echo   1. Open generate-icons.html in your browser
echo   2. Click "Download" under each icon size
echo   3. Save all icons to the /icons/ folder
echo.
echo Opening generate-icons.html now...
start generate-icons.html

:end
echo.
pause

