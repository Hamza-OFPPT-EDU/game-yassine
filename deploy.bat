@echo off
echo Building the project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo Deploying to Netlify...
call npx netlify deploy --prod
if %ERRORLEVEL% neq 0 (
    echo Deployment failed!
    pause
    exit /b %ERRORLEVEL%
)

echo Deployment completed successfully!
pause
