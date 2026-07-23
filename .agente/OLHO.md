# OLHO - Análise do Projeto Olho Vivo

## Status da análise

Análise técnica concluída com foco em arquitetura, riscos e prioridades de evolução.

## Arquitetura atual

O projeto está organizado em três blocos principais:

- Frontend: aplicação React/Vite com rotas para dashboard, eventos, validação e páginas operacionais.
- Backend: API FastAPI responsável por receber eventos, persistir dados em PostgreSQL via SQLAlchemy e oferecer endpoints de estatísticas e validação.
- Vision: serviço independente em Python com OpenCV, YOLO11, ByteTrack e um motor de regras para gerar eventos a partir de vídeo.

A infraestrutura é orquestrada com Docker Compose, com PostgreSQL e Redis como suportes básicos. O fluxo principal é: vídeo → detecção/tracking → regras → evento → persistência no backend.

## Problemas encontrados

### Arquitetura
- Configuração fortemente hardcoded, incluindo banco, endpoints e parâmetros operacionais.
- Acoplamento elevado entre visão e backend, sem fila, contrato formal ou camada de integração robusta.
- Modelo de domínio ainda simplificado para crescimento comercial.
- Falta de autenticação e autorização claras.

### Operação e evolução
- Ausência de observabilidade, métricas e health checks mais robustos.
- Pouca resiliência para falhas de rede, processamento e persistência.
- Falta de testes automatizados e migrações de banco bem estruturadas.
- Estrutura ainda muito prototípica para operar em múltiplas filiais com estabilidade.

## Melhorias recomendadas

1. Externalizar configuração e segredos para variáveis de ambiente.
2. Introduzir autenticação, autorização e modelo de filiais/câmeras/usuários.
3. Substituir o fluxo direto por uma camada assíncrona de mensageria.
4. Definir contratos claros entre visão e backend.
5. Melhorar separação entre serviços, regras de negócio e persistência.
6. Adicionar testes, monitoramento e recuperação de falhas.
7. Preparar a arquitetura para escalabilidade horizontal e múltiplas fontes de vídeo.

## Backlog priorizado

### Prioridade 0 - Essencial
- Externalizar configuração e segredos.
- Implementar autenticação e autorização.
- Definir modelo de filiais, câmeras e usuários.
- Introduzir fila ou broker para eventos de visão.

### Prioridade 1 - Estruturação arquitetural
- Criar camada de serviços e repositórios no backend.
- Definir migrações de banco e versionamento de schema.
- Padronizar contratos de API e modelos de resposta.
- Melhorar logging e tratamento de erros.

### Prioridade 2 - Robustez operacional
- Adicionar health checks e monitoramento.
- Melhorar tolerância a falhas no pipeline de vídeo.
- Implementar testes automatizados.
- Criar estratégia para múltiplas fontes de vídeo.

### Prioridade 3 - Produto
- Aprimorar dashboard e validação.
- Melhorar desempenho da interface.
- Criar auditoria e histórico operacional.
- Expandir regras de análise.

## O que eu faria primeiro

1. Externalizar configuração e segredos.
2. Definir autenticação e modelo de tenancy para filiais.
3. Introduzir uma camada de fila ou broker para desacoplar visão e backend.
4. Adicionar health checks, logging estruturado e testes iniciais.

## Progresso atual

- Revisão técnica concluída do repositório atual, incluindo estrutura de frontend, backend, visão e infraestrutura.
- Identificado que a maior prioridade de evolução continua sendo a maturação arquitetural para operação comercial: externalização de configuração, autenticação, desacoplamento de eventos e observabilidade.
- Definido que o próximo passo prático deve ser concentrar esforços em configuração por ambiente e saúde operacional do sistema.
- Sprint Central de Validação concluída com a recuperação do pipeline de eventos: o processor passou a gerar eventos com snapshot e vídeo, o backend passou a persistir esses campos e a rota de validação passou a devolver os dados esperados.

## Resumo executivo

O projeto tem uma base sólida para um MVP e uma direção boa para produto, mas ainda precisa de maior maturidade arquitetural antes de ser tratado como solução comercial robusta.
