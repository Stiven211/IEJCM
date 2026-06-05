<# 
.SYNOPSIS
    Script de automatización Git para Denisse - IEJCM
.DESCRIPTION
    Automatiza el flujo de trabajo diario con la rama developer compartida
.EXAMPLE
    ./git-denisse.ps1 start     # Antes de trabajar: pull + merge developer
    ./git-denisse.ps1 save      # Commit rápido con mensaje
    ./git-denisse.ps1 push      # Sube a developer (rama compartida)
    ./git-denisse.ps1 sync      # Trae cambios de Stiven desde developer
    ./git-denisse.ps1 status    # Muestra estado de ramas
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start', 'save', 'push', 'sync', 'status', 'help')]
    [string]$Command,

    [string]$Message
)

$BRANCH_PERSONAL = "denisse"
$BRANCH_SHARED = "developer"
$BRANCH_MAIN = "main"

function Write-Header($text) {
    Write-Host "`n=== $text ===" -ForegroundColor Magenta
}

function Write-Success($text) {
    Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Error($text) {
    Write-Host "✗ $text" -ForegroundColor Red
}

function Write-Info($text) {
    Write-Host "ℹ $text" -ForegroundColor Yellow
}

function Run-Git($args) {
    Write-Host "  > git $args" -ForegroundColor DarkGray
    $result = git $args 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error: $result"
        exit 1
    }
    if ($result) { Write-Host "  $result" }
    return $result
}

function Check-CleanWorkingTree() {
    $status = git status --porcelain
    if ($status) {
        Write-Error "Tienes cambios sin commitear. Haz commit o stash primero."
        git status --short
        exit 1
    }
}

if ($Command -eq 'help') {
    Write-Host @"
Uso: ./git-denisse.ps1 <comando> [mensaje]

Comandos:
  start    - Antes de trabajar: pull tu rama + merge developer
  save     - Commit rápido: git add . + commit -m "mensaje"
  push     - Sube tus cambios a developer (rama compartida)
  sync     - Trae cambios de Stiven desde developer a tu rama
  status   - Muestra estado de todas las ramas
  help     - Muestra esta ayuda

Ejemplos:
  ./git-denisse.ps1 start
  ./git-denisse.ps1 save "feat: agregar login"
  ./git-denisse.ps1 push
  ./git-denisse.ps1 sync
"@
}
elseif ($Command -eq 'start') {
    Write-Header "INICIANDO JORNADA - Denisse"
    
    Write-Info "Cambiando a rama $BRANCH_PERSONAL..."
    Run-Git "checkout $BRANCH_PERSONAL"
    
    Write-Info "Actualizando tu rama desde remoto..."
    Run-Git "pull origin $BRANCH_PERSONAL"
    
    Write-Info "Trayendo cambios compartidos de $BRANCH_SHARED..."
    $result = Run-Git "merge $BRANCH_SHARED"
    
    if ($result -like "*CONFLICT*" -or $result -like "*conflict*") {
        Write-Error "¡CONFLICTOS DETECTADOS!"
        Write-Host "Resuélvelos manualmente, luego ejecuta:" -ForegroundColor Yellow
        Write-Host "  git add ."
        Write-Host "  git commit"
        Write-Host "  ./git-denisse.ps1 push"
        exit 1
    }
    
    Write-Success "¡Listo para trabajar! Rama actual: $BRANCH_PERSONAL"
}
elseif ($Command -eq 'save') {
    Write-Header "GUARDANDO CAMBIOS - Denisse"
    
    if (-not $Message) {
        Write-Error "Debes proporcionar un mensaje: ./git-denisse.ps1 save \"feat: tu mensaje\""
        exit 1
    }
    
    Run-Git "add ."
    Run-Git "commit -m \"$Message\""
    Write-Success "Commit guardado: $Message"
}
elseif ($Command -eq 'push') {
    Write-Header "SUBIENDO A DEVELOPER - Denisse"
    
    Check-CleanWorkingTree
    
    Write-Info "Subiendo $BRANCH_PERSONAL → $BRANCH_SHARED en remoto..."
    Run-Git "push origin ${BRANCH_PERSONAL}:${BRANCH_SHARED}"
    
    Write-Success "¡Cambios subidos a developer! Stiven ya puede hacer sync."
}
elseif ($Command -eq 'sync') {
    Write-Header "SINCRONIZANDO CON DEVELOPER - Denisse"
    
    Check-CleanWorkingTree
    
    Write-Info "Actualizando tu rama personal..."
    Run-Git "pull origin $BRANCH_PERSONAL"
    
    Write-Info "Trayendo cambios de Stiven desde $BRANCH_SHARED..."
    $result = Run-Git "merge $BRANCH_SHARED"
    
    if ($result -like "*CONFLICT*" -or $result -like "*conflict*") {
        Write-Error "¡CONFLICTOS DETECTADOS!"
        Write-Host "Resuélvelos manualmente, luego ejecuta:" -ForegroundColor Yellow
        Write-Host "  git add ."
        Write-Host "  git commit"
        Write-Host "  ./git-denisse.ps1 push"
        exit 1
    }
    
    Write-Info "Subiendo tu rama sincronizada..."
    Run-Git "push origin $BRANCH_PERSONAL"
    
    Write-Success "¡Sincronizado! Tienes los últimos cambios de Stiven."
}
elseif ($Command -eq 'status') {
    Write-Header "ESTADO DE RAMAS - IEJCM"
    
    Write-Info "Ramas locales:"
    git branch -vv
    
    Write-Info "`nÚltimos commits:"
    git log --oneline -5 --all --graph --decorate
    
    Write-Info "`nEstado working tree:"
    git status --short
}