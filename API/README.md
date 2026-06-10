# Astra API (backend de proxy)

Backend em Node.js + Express que funciona como proxy das APIs externas usadas
pelo app Astra (NASA APOD/NeoWs, Open-Meteo, ISS, geocodificacao e traducao). O
app mobile chama este backend em vez de bater direto nas APIs de terceiros.

Aviso: este servico foi construido com vulnerabilidades intencionais para o
modulo de Ciberseguranca. Nao publique na internet, rode apenas local ou em
Docker.

## Como rodar

Node:

```bash
cd API
npm install
npm start          # http://localhost:3001
```

Docker:

```bash
cd API
docker compose up --build   # http://localhost:3001
```

## Endpoints

Proxies (espelham os upstreams):

| Rota | Upstream |
|---|---|
| GET /api/nasa/planetary/apod | NASA APOD (chave injetada no servidor) |
| GET /api/nasa/neo/rest/v1/feed | NASA NeoWs |
| GET /api/openmeteo/v1/forecast | Open-Meteo |
| GET /api/iss/v1/satellites/25544 | wheretheiss.at |
| GET /api/bigdatacloud/data/reverse-geocode-client | BigDataCloud |
| GET /api/gtx/translate_a/single | Google Translate |
| GET /api/health | Healthcheck |

Endpoints inseguros (sao o alvo do exercicio):

| Rota | Vulnerabilidade |
|---|---|
| GET /api/proxy?url= | SSRF (V4) |
| GET /api/diagnostics/ping?host= | Command Injection (V7) |
| GET /api/files?name= | Path Traversal (V8) |
| GET /api/debug/config | Exposicao de segredos (V1/V6) |
| GET /api/admin/secrets?token= | Broken Auth (V5) |

## Como o app usa este backend

No app (raiz do projeto), defina a variavel de ambiente apontando para o backend:

```bash
# .env do app (Expo)
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Com isso, os servicos do app (src/services) passam a chamar este proxy. Sem a
variavel, o app chama as APIs externas diretamente.

## Ligacao com a entrega de DevSecOps

Este backend e o alvo do modulo de Ciberseguranca:

1. Mapeamento de riscos: tabela no README principal do repositorio.
2. Controles: lint de seguranca/SAST (ESLint + Semgrep) e analise de
   dependencias (npm audit), rodando no CI.
3. Implementacao pratica: checagem automatizada no pipeline (lint de seguranca)
   no GitHub Actions. Config, script e evidencias em security/ e em
   .github/workflows/security-lint.yml.
4. Simulacao: o lint detecta o codigo inseguro, o deploy e bloqueado (exit 1) e
   depois a correcao e aplicada. Evidencias em security/reports/.
