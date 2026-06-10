# Checagem automatizada de seguranca no pipeline

Esta pasta tem a implementacao pratica do modulo: uma checagem de seguranca que
roda no GitHub Actions a cada push/pull request e bloqueia o deploy quando
encontra problema no codigo ou nas dependencias.

## Controles

1. Lint de seguranca (SAST): ESLint com eslint-plugin-security e Semgrep. Pega
   command injection, path traversal, timing attack e SSRF.
2. Analise de dependencias (SCA): npm audit. Pega CVEs nas bibliotecas.

Os dois rodam no pipeline (.github/workflows/security-lint.yml) como gate.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| ../eslint.config.js | Config do ESLint de seguranca |
| ../package.json | Scripts lint:security (gate) e lint:security:report |
| ../../.github/workflows/security-lint.yml | Pipeline (ESLint, Semgrep e npm audit) |
| lint-security.sh | Roda os 3 localmente e salva as evidencias |
| reports/01-eslint-security.txt | Saida do ESLint |
| reports/02-semgrep.txt | Saida do Semgrep |
| reports/03-npm-audit.txt | Saida do npm audit |
| pipeline-diagram.png | Diagrama do pipeline |

## Como rodar

```bash
cd API
npm install
npm run lint:security          # gate: falha (exit 1) se achar problema
npm run lint:security:report   # so lista os achados, nao falha

./security/lint-security.sh    # roda ESLint + Semgrep + npm audit e salva evidencias
```

No GitHub Actions roda sozinho a cada push/pull request.

## Resultado no codigo vulneravel

```
API/routes/vulnerable.js
  39:3  warning  Found child_process.exec() with non Literal first argument   security/detect-child-process
  49:3  warning  Found readFile from "fs" with non literal argument at index 0 security/detect-non-literal-fs-filename
  64:3  warning  Potential timing attack, left side: true                      security/detect-possible-timing-attacks

3 problems  ->  exit code 1  (deploy bloqueado)
```

| Achado | Linha | Risco |
|---|---|---|
| detect-child-process | 39 | Command injection |
| detect-non-literal-fs-filename | 49 | Path traversal |
| detect-possible-timing-attacks | 64 | Comparacao de token insegura |

O Semgrep confirma 2 achados (command injection e path traversal). O npm audit
encontra 12 vulnerabilidades (1 critical, 6 high).

## Simulacao

1. Problema: exec()/fs com entrada do usuario e dependencias com CVE.
2. Deteccao: o lint e o npm audit acham os problemas no pipeline.
3. Acao: os checks retornam exit code 1, o job falha e o deploy e bloqueado.
4. Correcao: removendo os endpoints inseguros e atualizando as bibliotecas, os
   checks passam e o deploy e liberado.
