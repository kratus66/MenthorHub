# --- Configuración de rutas ---
$REPO_DIR = "C:\Users\Administrator\repositories\MentorHub-PF"
$BACKEND_DIR = "$REPO_DIR\back"
$FRONTEND_DIR = "$REPO_DIR\front"

# --- 1. Despliegue del Backend (NestJS) ---
Write-Output "=== Iniciando despliegue del Backend ==="
Set-Location $BACKEND_DIR

# Detener procesos previos
taskkill /F /IM node.exe 2> $null

# Actualizar código y dependencias
# git pull origin main
git pull origin dev
npm install --production
npm run build

# Iniciar backend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run start:prod"
Write-Output "Backend desplegado en http://localhost:3000"

# Esperar 10 segundos
Start-Sleep -Seconds 10

# --- 2. Despliegue del Frontend (Vite/React) ---
Write-Output "=== Iniciando despliegue del Frontend ==="
Set-Location $FRONTEND_DIR

# Detener procesos previos
taskkill /F /IM node.exe 2> $null

# Actualizar código y dependencias
# git pull origin main
git pull origin dev
npm install --production
npm run build

# Iniciar frontend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run preview"
Write-Output "Frontend desplegado en http://localhost:4173"

Write-Output "=== ¡Despliegue completado! ==="