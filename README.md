# Astra - Modulo de Ciberseguranca (DevSecOps)

Entrega da atividade de Ciberseguranca da Global Solution. O Astra e um app
mobile (React Native + Expo) que usa dados espaciais e de clima (NASA, ISS,
Open-Meteo). Para o modulo de DevSecOps trabalhamos o backend de proxy do app
(pasta API/) e colocamos uma checagem de seguranca automatica no pipeline.

## Integrantes

| Nome | RM |
|---|---|
| Erick Molina | 553852 |
| Felipe Castro Salazar | 553464 |
| Marcelo Vieira de Melo | 552953 |
| Rayara Amaro Figueiredo | 552635 |
| Victor Rodrigues | 554158 |

## Estrutura do repositorio

- API/ - backend de proxy em Node/Express (o alvo da analise de seguranca).
- API/VULNERABILITIES.md - mapeamento dos riscos e vulnerabilidades.
- API/eslint.config.js - configuracao do lint de seguranca.
- API/security/ - a checagem de seguranca: script, evidencias e diagrama.
- .github/workflows/security-lint.yml - pipeline que roda a checagem no GitHub.
- src/ - codigo do app mobile (contexto do projeto).

## Mapeamento de riscos

| Risco | Onde no projeto | Controle |
|---|---|---|
| Vazamento de segredos | chave da NASA e .env no codigo | gestao de segredos |
| Imagem de conteiner vulneravel | Dockerfile com node:14 e root | imagem atual e nao-root |
| Dependencias inseguras | bibliotecas antigas (axios, lodash...) | npm audit |
| Permissoes excessivas / SSRF | proxy aberto, sem autenticacao | Zero Trust e SAST |
| Falta de monitoramento | sem logs e alertas | logging e alertas |
| Codigo inseguro (exec/fs) | command injection e path traversal | lint de seguranca |

Detalhes em API/VULNERABILITIES.md.

## Controles de seguranca

1. Lint de seguranca (SAST): ESLint com eslint-plugin-security e Semgrep,
   rodando no pipeline. Acha command injection, path traversal e timing attack.
2. Analise de dependencias (SCA): npm audit, no mesmo pipeline. Acha CVEs nas
   bibliotecas.

Os dois funcionam como gate: se acham problema, o job falha e o deploy e
bloqueado.

## Como rodar a checagem

```bash
cd API
npm install
npm run lint:security          # falha (exit 1) se achar problema
./security/lint-security.sh    # roda ESLint + Semgrep + npm audit e salva evidencias
```

No GitHub Actions a checagem roda sozinha a cada push e pull request.

## Pipeline

O diagrama esta em API/security/pipeline-diagram.png. A checagem entra entre o
build e o deploy: roda o lint de seguranca e o npm audit; se passa, segue para o
deploy; se acha algo vulneravel, bloqueia.

## Simulacao

1. O backend tem endpoints inseguros (exec e fs com entrada do usuario) e
   bibliotecas com CVE.
2. O lint e o npm audit detectam os problemas no pipeline.
3. Os checks retornam exit code 1, o job falha e o deploy e bloqueado.
4. Corrigindo (remover os endpoints e atualizar as bibliotecas) os checks passam
   e o deploy e liberado.

Evidencias em API/security/reports/.

## ODS

O projeto se relaciona com os ODS 9 (industria, inovacao e infraestrutura),
11 (cidades e comunidades sustentaveis) e 13 (acao contra a mudanca do clima).
