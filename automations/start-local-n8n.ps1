param(
    [string]$RuntimePath = (Join-Path (Split-Path $PSScriptRoot -Parent | Split-Path -Parent) '.runtime-diario-n8n')
)
$ErrorActionPreference = 'Stop'
$runtime = [System.IO.Path]::GetFullPath($RuntimePath)
$entry = Join-Path $runtime 'node_modules/n8n/bin/n8n'
if (-not (Test-Path -LiteralPath $entry)) {
    throw "Falta n8n en $runtime. Instalar con npm install n8n dentro de esa carpeta dedicada."
}
if (Get-NetTCPConnection -LocalPort 5678 -State Listen -ErrorAction SilentlyContinue) {
    throw 'El puerto 5678 ya esta ocupado; comprobar la instancia existente antes de iniciar otra.'
}
$env:N8N_USER_FOLDER = Join-Path $runtime 'data'
$env:N8N_LISTEN_ADDRESS = '127.0.0.1'
$env:N8N_HOST = '127.0.0.1'
$env:N8N_PORT = '5678'
$env:N8N_PROTOCOL = 'http'
$env:N8N_EDITOR_BASE_URL = 'http://127.0.0.1:5678'
$env:WEBHOOK_URL = 'http://127.0.0.1:5678/'
$env:N8N_SECURE_COOKIE = 'false'
$env:N8N_DIAGNOSTICS_ENABLED = 'false'
$env:N8N_PERSONALIZATION_ENABLED = 'false'
$env:N8N_VERSION_NOTIFICATIONS_ENABLED = 'false'
$env:N8N_RUNNERS_BROKER_LISTEN_ADDRESS = '127.0.0.1'
$node = (Get-Command node).Source
$process = Start-Process -FilePath $node -ArgumentList @('"' + $entry + '"', 'start') `
    -WorkingDirectory $runtime -WindowStyle Hidden -PassThru `
    -RedirectStandardOutput (Join-Path $runtime 'n8n.stdout.log') `
    -RedirectStandardError (Join-Path $runtime 'n8n.stderr.log')
Write-Output "n8n local iniciado: PID $($process.Id), http://127.0.0.1:5678"
Write-Output 'Datos y credenciales cifradas en runtime privado fuera del repositorio.'
