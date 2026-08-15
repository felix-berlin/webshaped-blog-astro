# Docker Smoke Test (Proxy Stack)

Automatisierter Smoke Test für das Docker-Setup mit Nginx-Proxy vor der Astro-App. Läuft bei jedem PR und prüft die wichtigsten Funktionen des produktionsnahen Stacks.

## Was wird getestet?

Der Smoke Test prüft folgende Punkte:

1. **Compose Build/Start** – Startet App und Nginx-Proxy via `docker compose -f compose.yaml up`
2. **Proxy Health Check** – Überprüft den öffentlichen HTTP-Endpoint des Proxys
3. **Root Response via Proxy** – Prüft, dass `/` auf `/de` weiterleitet und die Startseite (`/de`) über den Proxy lädt
4. **Host Redirect** – Prüft Weiterleitung von www.webshaped.de → webshaped.de
5. **Legacy Redirect** – Prüft Weiterleitung alter Post-URLs auf `/de/posts/...`
6. **Brotli & Gzip Compression** – Stellt sicher, dass beide Kompressionsarten aktiv sind
7. **404 Passthrough** – Testet, dass 404-Fehler korrekt über den Proxy durchgereicht werden
8. **Log Analysis** – Analysiert die Logs aller Container auf Fehler

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
# Alternativer Host-Port (z. B. falls 80/8080 belegt ist)
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

Das Skript baut App und Proxy, prüft Redirects, Kompression und 404-Verhalten und räumt den Stack nach Abschluss automatisch auf.

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
