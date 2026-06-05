<# 
.SYNOPSIS
    Script de automatización Git para Stiven - IEJCM
.DESCRIPTION
    Automatiza el flujo de trabajo diario con la rama developer compartida
.EXAMPLE
    ./git-stiven.ps1 start     # Antes de trabajar: pull + merge developer
    ./git-stiven.ps1 save      # Commit rápido con mensaje
    ./git-stiven.ps1 push      # Sube a developer (rama compartida)
    ./git-stiven.ps1 sync      # Trae cambios de Denisse desde developer
    ./git-stiven.ps1 status    # Muestra estado de ramas
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start', 'save', 'push', 'sync', 'status', 'help')]
    [string]$Command,

    [string]$Message
)

$BRANCH_PERSONAL = "stiven"
$BRANCH_SHARED = "developer"
$BRANCH_MAIN = "main"

function Run-Git($args) {
    Write-Host "  > git $args" -ForegroundColor DarkGray
    $result = git $args 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Error: $result" -ForegroundColor Red
        exit 1
    }
    if ($result) { Write-Host "  $result" }
    return $result
}

function Check-CleanWorkingTree() {
    $status = git status --porcelain
    if ($status) {
        Write-Host "✗ Tienes cambios sin commitear. Haz commit o stash primero." -ForegroundColor Red
        git status --short
        exit 1
    }
}

if ($Command -eq 'help') {
    Write-Host @"
Uso: ./git-stiven.ps1 <comando> [mensaje]

Comandos:
  start    - Antes de trabajar: pull tu rama + merge developer
  save     - Commit rápido: git add . + commit -m "mensaje"
  push     - Sube tus cambios a developer (rama compartida)
  sync     - Trae cambios de Denisse desde developer a tu rama
  status   - Muestra estado de todas las ramas
  help     - Muestra esta ayuda

Ejemplos:
  ./git-stiven.ps1 start
  ./git-stiven.ps1 save "feat: agregar login"
  ./git-stiven.ps1 push
  ./git-stiven.ps1 sync
"@
}
elseif ($Command -eq 'start') {
    Write-Host "`n=== INICIANDO JORNADA - Stiven ===" -ForegroundColor Cyan
    
    Write-Host "ℹ Cambiando a rama $BRANCH_PERSONAL..." -ForegroundColor Yellow
    Run-Git "checkout $BRANCH_PERSONAL"
    
    Write-Host "ℹ Actualizando tu rama desde remoto..." -ForegroundColor Yellow
    Run-Git "pull origin $BRANCH_PERSONAL"
    
    Write-Host "ℹ Trayendo cambios compartidos de $BRANCH_SHARED..." -ForegroundColor Yellow
    $result = Run-Git "merge $BRANCH_SHARED"
    
    if ($result -like "*CONFLICT*" -or $result -like "*conflict*") {
        Write-Host "✗ ¡CONFLICTOS DETECTADOS!" -ForegroundColor Red
        Write-Host "Resuélvelos manualmente, luego ejecuta:" -ForegroundColor Yellow
        Write-Host "  git add ."
        Write-Host "  git commit"
        Write-Host "  ./git-stiven.ps1 push"
        exit 1
    }
    
    Write-Host "✓ ¡Listo para trabajar! Rama actual: $BRANCH_PERSONAL" -ForegroundColor Green
}
elseif ($Command -eq 'save') {
    Write-Host "`n=== GUARDANDO CAMBIOS - Stiven ===" -ForegroundColor Cyan
    
    if (-not $Message) {
        Write-Host "✗ Debes proporcionar un mensaje: ./git-stiven.ps1 save \"feat: tu mensaje\"" -ForegroundColor Red
        exit 1
    }
    
    Run-Git "add ."
    Run-Git "commit -m \"$Message\""
    Write-Host "✓ Commit guardado: $Message" -ForegroundColor Green
}
elseif ($Command -eq 'push') {
    Write-Host "`n=== SUBIENDO A DEVELOPER - Stiven ===" -ForegroundColor Cyan
    
    Check-CleanWorkingTree
    
    Write-Host "ℹ Subiendo $BRANCH_PERSONAL → $BRANCH_SHARED en remoto..." -ForegroundColor Yellow
    Run-Git "push origin ${BRANCH_PERSONAL}:${BRANCH_SHARED}"
    
    Write-Host "✓ ¡Cambios subidos a developer! Denisse ya puede hacer sync." -ForegroundColor Green
}
elseif ($Command -eq 'sync') {
    Write-Host "`n=== SINCRONIZANDO CON DEVELOPER - Stiven ===" -ForegroundColor Cyan
    
    Check-CleanWorkingTree
    
    Write-Host "ℹ Actualizando tu rama personal..." -ForegroundColor Yellow
    Run-Git "pull origin $BRANCH_PERSONAL"
    
    Write-Host "ℹ Trayendo cambios de Denisse desde $BRANCH_SHARED..." -ForegroundColor Yellow
    $result = Run-Git "merge $BRANCH_SHARED"
    
    if ($result -like "*CONFLICT*" -or $result -like "*conflict*") {
        Write-Host "✗ ¡CONFLICTOS DETECTADOS!" -ForegroundColor Red
        Write-Host "Resuélvelos manualmente, luego ejecuta:" -ForegroundColor Yellow
        Write-Host "  git add ."
        Write-Host "  git commit"
        Write-Host "  ./git-stiven.ps1 push"
        exit 1
    }
    
    Write-Host "ℹ Subiendo tu rama sincronizada..." -ForegroundColor Yellow
    Run-Git "push origin $BRANCH_PERSONAL"
    
    Write-Host "✓ ¡Sincronizado! Tienes los últimos cambios de Denisse." -ForegroundColor Green
}
elseif ($Command -eq 'status') {
    Write-Host "`n=== ESTADO DE RAMAS - IEJCM ===" -ForegroundColor Cyan
    
    Write-Host "ℹ Ramas locales:" -ForegroundColor Yellow
    git branch -vv
    
    Write-Host "`nℹ Últimos commits:" -ForegroundColor Yellow
    git log --oneline -5 --all --graph --decorate
    
    Write-Host "`nℹ Estado working tree:" -ForegroundColor Yellow
    git status --short
}