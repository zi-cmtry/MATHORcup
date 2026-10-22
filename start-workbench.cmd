@echo off
cd /d "%~dp0"
node "%~dp0start-workbench.cjs" --open
if errorlevel 1 pause
