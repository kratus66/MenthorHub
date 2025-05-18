# --- Configuración de rutas ---
$REPO_DIR = "C:\Users\Administrator\repositories\MentorHub-PF"
$BACKEND_DIR = "$REPO_DIR\back"
$FRONTEND_DIR = "$REPO_DIR\front"

# --- 1. Detener todos los procesos Node existentes ---
Write-Output "=== Deteniendo procesos anteriores ==="
kill-port 3001 4173
taskkill /F /IM node.exe /T 2> $null
kill-port 3001 4173

# --- 2. Actualizar repositorio ---
Write-Output "=== Actualizando código desde GitHub ==="
Set-Location $REPO_DIR
# git pull origin main
git pull origin dev

# --- 3. Despliegue del Backend ---
# Write-Output "=== Desplegando Backend ==="
# Set-Location $BACKEND_DIR

# npm install
# npm run build

# # Iniciar backend en una nueva ventana de PowerShell
# # Start-Process powershell -ArgumentList "-Command", "cd '$BACKEND_DIR'; npm start" -WindowStyle Minimized
# Start-Process powershell -ArgumentList "-Command", "cd '$BACKEND_DIR'; npm run start:dev" -WindowStyle Minimized
# Write-Output "Backend iniciado en http://localhost:3001"

# Start-Sleep -Seconds 10

# --- 4. Despliegue del Frontend ---
Write-Output "=== Desplegando Frontend ==="
Set-Location $FRONTEND_DIR

npm install
npm run build

# Iniciar frontend en una nueva ventana de PowerShell
Start-Process powershell -ArgumentList "-Command", "cd '$FRONTEND_DIR'; npm run preview" -WindowStyle Minimized
# Start-Process powershell -ArgumentList "-Command", "cd '$FRONTEND_DIR'; npm run dev" -WindowStyle Minimized
Write-Output "Frontend iniciado en http://localhost:4173"

Write-Output "=== ¡Despliegue completado! ==="