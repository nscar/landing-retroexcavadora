# Contexto del Proyecto

Este proyecto es una landing page de retroexcavadora, desarrollada con Hermes War Room.

## Configuración de Hermes War Room

- **War Room**: http://localhost:3001
- **Gateway**: `hermes gateway start` (servicio systemd: `hermes-gateway-arquitecto`)
- **Perfiles Hermes**: arquitecto, auditor, dba, frontend, purista

## Configuración Aplicada

En `~/.hermes/config.yaml`:
- `max_concurrent_children: 5` (permite 5 agentes paralelos)
- `max_iterations: 100` (tareas largas)
- `max_spawn_depth: 2` (delegación anidada)
- `env: local` (entorno terminal, corregido de `commandcode`)

## Problemas Conocidos y Soluciones

### Si agentes se frenan:
1. Verificar gateway: `hermes gateway status`
2. Verificar configuración: `grep -A5 "delegation:" ~/.hermes/config.yaml`
3. Si hay locks de gateway: `rm -f ~/.hermes/profiles/*/gateway.lock`

### Si War Room no carga:
```bash
pkill -f "node.*war-room"
cd ~/hermes-war-room && pnpm dev
```

### Error "Unknown environment type: commandcode":
Corregido en `~/.hermes/config.yaml` → `env: local`

## Referencias

- Repo War Room: https://github.com/Naroh091/hermes-war-room
- Skill troubleshooting: `~/.config/opencode/skills/hermes-war-room-troubleshoot/SKILL.md`
- Changelog: `hermes-war-room/CHANGELOG-WAR-ROOM.md`

## Orden de Inicio
1. `hermes gateway start`
2. `cd ~/hermes-war-room && pnpm dev`
3. Abrir `http://localhost:3001`