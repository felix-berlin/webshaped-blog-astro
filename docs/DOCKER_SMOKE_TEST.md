# Docker Smoke Test

Automatisierter Smoke Test für das Docker-Image der Astro-App. Läuft bei jedem PR und prüft die App direkt, ohne Reverse Proxy. www-Redirect, Kompression und Security-Header liegen in Produktion bei Traefik (komodo-Repo) und werden hier nicht getestet.

## Was wird getestet?

Der Smoke Test prüft folgende Punkte:

1. **Compose Build/Start** – Baut und startet die App via `docker compose -f compose.yaml up --wait` (wartet auf den Healthcheck)
2. **App Health Check** – Überprüft den veröffentlichten HTTP-Port der App
3. **Root Response** – Prüft, dass `/` auf `/de` weiterleitet und die Startseite (`/de`) lädt
4. **Legacy Redirects** – Prüft die 301-Weiterleitung alter Post-URLs auf `/de/posts/...` (aus `src/middleware.ts`), inkl. Query-String
5. **404** – Testet, dass unbekannte Pfade 404 liefern
6. **Log Analysis** – Analysiert die Container-Logs auf Fehler

## Lokal ausführen

### 1) Umgebung vorbereiten

Der Smoke Test braucht Build- und Runtime-Variablen. Erzeuge `.env` (und `.build.env`) über Infisical, siehe CLAUDE.md ("Secrets"):

```bash
infisical run --env=dev -- scripts/write-build-env.sh .build.env quoted
infisical run --env=dev -- scripts/write-build-env.sh .env raw
```

### 2) Smoke Test starten

```bash
# Standard
./scripts/docker-smoke-test.sh
```

```bash
# Alternativer Host-Port (z. B. falls 8080 belegt ist)
HOST_PORT=5432 ./scripts/docker-smoke-test.sh
```

```bash
# Separates Build-Env-File erzwingen (BuildKit Secret für Dockerfile)
BUILD_ENV_FILE=.build.env HOST_PORT=8080 ./scripts/docker-smoke-test.sh
```

Bei älteren Docker-Setups kann es nötig sein, BuildKit explizit zu aktivieren:

```bash
DOCKER_BUILDKIT=1 ./scripts/docker-smoke-test.sh
```

Das Skript baut die App, prüft Redirects und 404-Verhalten und räumt den Stack nach Abschluss automatisch auf.

## Logs analysieren

```bash
docker compose -f compose.yaml logs
```

Bei Fehlern schreibt das Skript automatisch eine Sammeldatei:

```text
./docker-smoke-test-compose.log
```

## Hinweise

- Docker und curl müssen installiert sein
- Für lokale Läufe muss `.env` vorhanden sein (per `infisical run` erzeugt, siehe oben)
- `BUILD_ENV_FILE` steuert die Secret-Datei für den App-Build (Default: `.build.env`)

## Exit Codes

- `0` – Alle Tests erfolgreich
- `1` – Fehler beim Build, Start, Health Check oder Smoke Test
