# Guía de Flujo de Trabajo Git - IEJCM

## Estructura de Ramas

```
main (protegida - solo merge final del proyecto completo)
  └── developer (rama compartida - tú y Denisse)
       ├── stiven (tu rama personal)
       └── denisse (rama de tu compañera)
```

**Regla de oro**: `main` NO SE TOCA hasta que el proyecto esté 100% terminado y funcionando.

---

## Ramas Actuales (Verificadas)

| Rama | Propósito | Quién la usa |
|------|-----------|--------------|
| `main` | Producción final | Nadie hace push directo |
| `developer` | Integración compartida | Stiven y Denisse |
| `stiven` | Tu trabajo personal | Solo tú |
| `denisse` | Trabajo de Denisse | Solo ella |

---

## Flujo Diario - Stiven

### 1. Antes de empezar a trabajar
```bash
git checkout stiven
git pull origin stiven
git merge developer
# Si hay conflictos: resuélvelos → git add . → git commit
```

### 2. Durante el desarrollo
```bash
git status
git add .
git commit -m "tipo: descripción breve"
# Ejemplos de tipos: feat, fix, docs, style, refactor, test, chore
```

### 3. Subir TUS cambios a developer (rama compartida)
```bash
# Opción A: Push directo (recomendado)
git push origin stiven:developer

# Opción B: Merge local + push
git checkout developer
git merge stiven
git push origin developer
git checkout stiven
```

### 4. Cuando Denisse subió cambios a developer
```bash
git checkout stiven
git pull origin stiven
git merge developer
# Resuelve conflictos si los hay
git push origin stiven
```

---

## Flujo Diario - Denisse

### 1. Antes de empezar a trabajar
```bash
git checkout denisse
git pull origin denisse
git merge developer
# Si hay conflictos: resuélvelos → git add . → git commit
```

### 2. Durante el desarrollo
```bash
git status
git add .
git commit -m "tipo: descripción breve"
```

### 3. Subir SUS cambios a developer (rama compartida)
```bash
# Opción A: Push directo (recomendado)
git push origin denisse:developer

# Opción B: Merge local + push
git checkout developer
git merge denisse
git push origin developer
git checkout denisse
```

### 4. Cuando Stiven subió cambios a developer
```bash
git checkout denisse
git pull origin denisse
git merge developer
# Resuelve conflictos si los hay
git push origin denisse
```

---

## Comandos de Emergencia

| Situación | Comando |
|-----------|---------|
| Cancelar merge en curso | `git merge --abort` |
| Descartar cambios en un archivo | `git checkout -- archivo` |
| Borrar TODO lo no commiteado | `git reset --hard HEAD` ⚠️ |
| Guardar cambios temporalmente | `git stash` |
| Recuperar stash | `git stash pop` |
| Ver diferencias antes de merge | `git diff developer..stiven` |

---

## Convención de Commits

```
<tipo>: <descripción breve>

Tipos:
  feat     - Nueva funcionalidad
  fix      - Corrección de bug
  docs     - Documentación
  style    - Formato (espacios, comas, etc)
  refactor - Refactorización de código
  test     - Tests
  chore    - Mantenimiento (deps, config, etc)
```

Ejemplos:
- `feat: agregar login con Supabase`
- `fix: corregir validación formulario eventos`
- `docs: actualizar README con instrucciones deploy`

---

## Verificar Estado

```bash
# Ver todas las ramas y su estado vs remoto
git branch -vv

# Ver commits recientes
git log --oneline -10

# Ver diferencias entre ramas
git diff developer..stiven
git diff developer..denisse
```

---

## Resumen Visual

```
TRABAJO LOCAL                    GITHUB (REMOTO)
─────────────────                ────────────────
stiven (tú)         ──push──→    origin/stiven
    │                                 │
    │ merge developer                 │
    ▼                                 ▼
developer (compartida) ──push──→     origin/developer  ← denisse también pushea aquí
    │
    │ (SOLO al final del proyecto)
    ▼
main (protegida)    ──push──→        origin/main  (PROTEGIDA - NO TOCAR)
```

---

## Scripts de Automatización

Ver archivos:
- `git-stiven.ps1` - Script para Stiven
- `git-denisse.ps1` - Script para Denisse

Uso: `./git-stiven.ps1 <comando>` donde comando puede ser: `start`, `save`, `push`, `sync`, `status`