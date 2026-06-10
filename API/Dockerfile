# ============================================================================
#  Dockerfile — Astra API
# ============================================================================
#  VULNERABILIDADE INTENCIONAL (Imagem de conteiner vulneravel — V3):
#   - Base "node:14": versao EOL, com muitas CVEs de sistema operacional.
#   - Instala dependencias vulneraveis (npm install, sem npm ci / --omit=dev).
#   - Copia TODO o contexto, inclusive o .env com segredos, para a imagem.
#   - Roda como root (sem USER nao-privilegiado) — privilegio excessivo.
#   - Sem HEALTHCHECK / sem minimizar superficie.
# ============================================================================
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

# Roda como root de proposito (o correto seria: USER node).
CMD ["node", "server.js"]
