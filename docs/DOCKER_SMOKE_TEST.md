
# Docker Smoke Test (Proxy Stack)

Automatisierter Smoke Test für das Docker-Setup mit Nginx-Proxy vor der Astro-App. Läuft bei jedem PR und prüft die wichtigsten Funktionen des produktionsnahen Stacks.

## Was wird getestet?

Der Smoke Test prüft folgende Punkte:

1. **Compose Build/Start** – Startet App und Nginx-Proxy via `docker compose -f compose.yaml up`
2. **Proxy Health Check** – Überprüft den öffentlichen HTTP-Endpoint des Proxys
3. **Root Response via Proxy** – Holt die Startseite über den Proxy
4. **Host Redirect** – Prüft Weiterleitung von www.webshaped.de → webshaped.de
5. **Legacy Redirect** – Prüft Weiterleitung alter Post-URLs auf `/de/posts/...`
6. **Brotli & Gzip Compression** – Stellt sicher, dass beide Kompressionsarten aktiv sind
7. **404 Passthrough** – Testet, dass 404-Fehler korrekt über den Proxy durchgereicht werden
8. **Log Analysis** – Analysiert die Logs aller Container auf Fehler

## Lokal ausführen

```bash
# Lokalen Smoke Test starten (z.B. auf Port 8080)
HOST_PORT=8080 ./scripts/docker-smoke-test.sh
```

Das Skript startet Proxy und App, prüft alle Redirects und Kompressionen und räumt nach Abschluss automatisch auf.

## Logs analysieren

```bash
docker compose -f compose.yaml logs
```

## Hinweise

- Docker und curl müssen installiert sein
- `.env.pipeline` muss für Build-Umgebungen existieren

## Exit Codes

- `0` – Alle Tests erfolgreich
- `1` – Fehler beim Build, Start, Health Check oder Smoke Test
