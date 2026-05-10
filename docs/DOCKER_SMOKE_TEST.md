# Docker Smoke Test

Ein automatisierter Smoke Test für das Docker-Image, der bei jeder PR läuft.

## Was wird getestet?

Der Smoke Test führt die folgenden Überprüfungen durch:

1. **Docker Image Build** - Stellt sicher, dass das Image erfolgreich gebaut wird
2. **Container Start** - Überprüft, dass der Container startet
3. **Health Check** - Wartet bis der Container gesund ist (curl response auf `http://localhost:4321/`)
4. **HTTP Response** - Stellt sicher, dass das Root-Endpoint mit HTTP 200 antwortet
5. **Content Type** - Überprüft dass HTML zurückgegeben wird
6. **Error Handling** - Testet dass 404-Fehlerseiten funktionieren
7. **Log Analysis** - Sucht nach Errors oder Exceptions in den Container-Logs

## Lokal testen

```bash
# Das Smoke Test Skript ausführen
./scripts/docker-smoke-test.sh
```

Das Skript wird:
- Das Docker Image bauen (`webshaped-blog-astro-smoke:local`)
- Einen Container starten
- Alle Tests durchführen
- Den Container automatisch aufräumen (auch bei Fehlern)

## GitHub Actions Integration

Der Smoke Test läuft automatisch:

- Bei **Pull Requests** die diese Dateien ändern:
  - `Dockerfile`
  - `compose.yaml`
  - `scripts/docker-smoke-test.sh`
  - `.env.pipeline`

- Bei **Push** auf `main` oder `beta` Branches mit den obigen Dateiänderungen

- **Manual Trigger**: Über GitHub Actions "workflow_dispatch"

## Workflow-Details

**Datei**: `.github/workflows/docker-smoke-test.yml`

- Läuft auf: `ubuntu-latest`
- Timeout: 15 Minuten
- Bei Fehler: Logs werden als Artifacts hochgeladen

## Health Checks

### Dockerfile Health Check

```dockerfile
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:4321/ || exit 1
```

- **Interval**: 10 Sekunden
- **Timeout**: 5 Sekunden
- **Retries**: 3 versuche
- **Check**: Curl auf HTTP Endpoint

### Docker Compose Health Check

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4321/"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 30s
```

- **Start Period**: 30 Sekunden (Zeit zum Starten)
- Ansonsten identisch mit Dockerfile

## Vorbedingungen

- Docker muss installiert sein
- curl muss im Docker Image verfügbar sein (ist im `node:lts-slim` Image enthalten)
- `.env.pipeline` muss existieren für die Build-Zeit Umgebungsvariablen

## Exit Codes

- `0` - Alle Tests erfolgreich
- `1` - Docker Build Fehler, Container Start Fehler, oder Health Check Timeout

## Tipps zur Fehlerbehebung

### Container wird nicht gesund

```bash
# Logs direkt anschauen
docker logs webshaped-blog-astro-smoke-test

# Health Status überprüfen
docker inspect webshaped-blog-astro-smoke-test | grep -A 5 Health
```

### Port bereits in Verwendung

```bash
# Prüfen welcher Prozess Port 4321 nutzt
lsof -i :4321

# Das Script verwendet `docker stop` zum Aufräumen, sollte aber automatisch funktionieren
```

### Curl fehlt im Image

Das sollte nicht passieren, da `node:lts-slim` curl bereits enthält. Falls trotzdem:

```dockerfile
# Das kann zur Dockerfile hinzugefügt werden
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```
