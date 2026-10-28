# Plan Interface

School timetable app: an Express API that scrapes the schedule site (`server/`)
and a Next.js client that renders it (`client/`). See `server/README.md` for
the API reference.

## Run with Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Client on http://localhost:3001, API on http://localhost:3000.

The client never calls the API host directly from the browser. It requests
same-origin `/api/*`, and the Next.js rewrite in `client/next.config.ts`
forwards those to `API_URL`, so the API paths stay the same when the host
changes.

## Changing where the client reads data from

`API_URL` in the root `.env` is the only knob:

```bash
API_URL=http://192.168.1.50:3000
```

Then rebuild and restart the client:

```bash
docker compose build client && docker compose up -d
```

The rebuild is required: the rewrite destination is baked into
`.next/routes-manifest.json` during the build, so a runtime `API_URL` alone
does not change where `next start` proxies.

Note that `docker compose` gives shell variables priority over `.env` — if
`API_URL` happens to be exported in your shell, it silently wins and the
`.env` edit appears to do nothing. Check with `env | grep API_URL`.

When `API_URL` points at a server that is not part of this compose project,
start only the client with `docker compose up -d client` — the local `server`
service has no profile attached, so a plain `up -d` still starts it.

Outside Docker (`npm run dev` in `client/`), the same value comes from
`client/.env.local` (see `client/.env.example`). Next.js reads it when it
loads the config, so a restart of the dev server is enough.
