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

## Como o DevSecOps foi integrado ao projeto

O Astra ja era versionado no GitHub e usava GitHub Actions para CI. A ideia do
DevSecOps foi colocar a seguranca dentro desse fluxo que ja existia, em vez de
deixar para o final. Para isso, adicionamos uma checagem de seguranca que roda
automaticamente a cada push e pull request, antes de qualquer deploy.

Essa checagem funciona como um gate no pipeline: analisa o codigo do backend
(lint de seguranca com ESLint e Semgrep) e as dependencias (npm audit). Se
encontra um problema, por exemplo command injection, path traversal ou uma
biblioteca com CVE, o job falha (exit code 1) e o deploy fica bloqueado ate a
correcao. Assim a seguranca vira uma etapa obrigatoria da entrega, e nao algo
manual ou feito depois (shift-left).

A integracao se divide em quatro partes, detalhadas nas secoes abaixo: o
mapeamento dos riscos do projeto, os dois controles de seguranca no CI (SAST e
SCA), o diagrama mostrando onde eles entram no pipeline e a simulacao do gate
bloqueando o deploy. As evidencias das execucoes ficam em API/security/reports/.

## Estrutura do repositorio

- API/ - backend de proxy em Node/Express (o alvo da analise de seguranca).
- API/eslint.config.js - configuracao do lint de seguranca.
- API/security/ - a checagem de seguranca: script, evidencias e diagrama.
- .github/workflows/security-lint.yml - pipeline que roda a checagem no GitHub.
- src/ - codigo do app mobile (contexto do projeto).

## Mapeamento de riscos

| Risco | Onde no projeto | Impacto | Controle |
|---|---|---|---|
| Vazamento de segredos | chave da NASA e .env no codigo | acesso indevido a APIs e dados | gestao de segredos |
| Imagem de conteiner vulneravel | Dockerfile com node:14 e root | comprometimento do host | imagem atual e nao-root |
| Dependencias inseguras | bibliotecas antigas (axios, lodash...) | exploracao de CVEs conhecidas | npm audit |
| Permissoes excessivas / SSRF | proxy aberto, sem autenticacao | acesso a rede interna e a metadados | Zero Trust e SAST |
| Falta de monitoramento | sem logs e alertas | incidentes nao detectados | logging e alertas |
| Codigo inseguro (exec/fs) | command injection e path traversal | execucao remota e leitura de arquivos | lint de seguranca |

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
