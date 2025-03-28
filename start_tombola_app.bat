@echo off
cd /d %~dp0
echo ----------------------------
echo Pornire Tombola App...
echo ----------------------------

echo Instalare dependente...
npm install

echo.
echo Pornire server local...
start http://localhost:5173/
npm run dev

pause
