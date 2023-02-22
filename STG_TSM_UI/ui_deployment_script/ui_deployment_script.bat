set PORT=443
set HOST=ipm.stgit.com
set PROFILES=production
for /f "tokens=2-7 delims=/:. " %%a in ("%date% %time%") do set LOG_FOLDER=log_%%a_%%b_%%d_%%e%%f
echo "Build Started %DATE% %TIME% , Log Folder  - %LOG_FOLDER%" > last-build-time.log
cd log_data
mkdir %LOG_FOLDER%
cd ..
cd STG_TSM_UI
git checkout production
git pull
FOR /F "tokens=5 delims= " %%P IN ('netstat -a -n -o ^| findstr :%PORT%') DO TaskKill.exe /PID %%P /F > ../log_data/%LOG_FOLDER%/old-task-kill-%PORT%.log 2> ../log_data/%LOG_FOLDER%/old-task-kill-%PORT%.err
ng s --host %HOST% --port %PORT% > ../../log_data/%LOG_FOLDER%/app-%PROFILES%-start-%PORT%.log 2> ../../log_data/%LOG_FOLDER%/app-%PROFILES%-start-%PORT%.err