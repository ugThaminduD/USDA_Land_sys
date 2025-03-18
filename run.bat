@echo off
start cmd /k "cd /d frontend && npm start"
@REM start cmd /k "cd /d admin && npm start"
start cmd /k "cd /d backend && nodemon server"