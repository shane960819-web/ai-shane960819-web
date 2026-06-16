@echo off
chcp 65001 > nul
title 國中社會科九合一學習門戶本地伺服器
echo 正在啟動社會科九合一互動學習入口網站本地伺服器...
powershell -NoProfile -ExecutionPolicy Bypass -File .\start_server.ps1
if errorlevel 1 (
    echo.
    echo 啟動失敗，請確認是否以「系統管理員身分」執行本檔案。
    pause
)
