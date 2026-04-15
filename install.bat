@echo off
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 goto error

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 goto error

echo.
echo All dependencies installed successfully!
echo.
echo To start the project:
echo 1. Backend: cd backend && npm run dev
echo 2. Frontend: cd frontend && npm run dev
goto end

:error
echo.
echo ERROR: Installation failed. Please check the error messages above.
goto end

:end
pause
