# Backlog priorizado — Projeto Olho Vivo

## Contexto

O projeto apresenta uma base funcional de MVP com frontend em React/Vite, backend em FastAPI e um serviço de visão em Python para detecção e geração de eventos. A arquitetura atual já permite fluxo de vídeo → detecção → regras → evento → persistência, mas ainda carece de maturidade para operação em ambiente real, segurança, resiliência e escalabilidade.

## Critérios de priorização

- Impacto direto em segurança, operação e confiabilidade.
- Dependência crítica para evolução do produto.
- Benefício imediato para uso real e crescimento comercial.
- Facilidade relativa de execução em etapas incrementais.

## Backlog priorizado

### P0 — Fundamentos de operação e segurança

1. Externalizar configuração e segredos
   - Substituir valores hardcoded de banco, portas, CORS e integrações por variáveis de ambiente.
   - Separar configuração por ambiente (dev, staging, prod).

2. Implementar autenticação e autorização
   - Definir modelo de usuários, papéis e permissões para acesso ao dashboard e aos fluxos de validação.
   - Proteger endpoints sensíveis.

3. Definir modelo de negócio base
   - Estruturar entidades como filiais, câmeras, usuários e permissões por contexto.
   - Reduzir dependência de campos simples como filial_id e camera_id soltos.

4. Desacoplar visão e backend
   - Introduzir fila ou broker para eventos vindos da visão.
   - Reduzir acoplamento direto entre os serviços e aumentar tolerância a falhas.

### P1 — Estruturação arquitetural

5. Melhorar organização do backend
   - Separar responsabilidades entre rotas, serviços, repositórios e modelos de domínio.
   - Evitar lógica de negócio espalhada em endpoints.

6. Definir migrações de banco e versionamento de schema
   - Estruturar alterações de banco de forma controlada e reprodutível.
   - Evitar mudanças manuais e inconsistentes no PostgreSQL.

7. Padronizar contratos de API
   - Definir modelos de entrada e saída consistentes.
   - Padronizar erros, status e respostas para frontend e integração.

8. Melhorar observabilidade inicial
   - Implementar logging estruturado, tracing básico e health checks mais completos.
   - Facilitar diagnóstico de falhas e rastreabilidade operacional.

### P2 — Robustez operacional

9. Adicionar testes automatizados
   - Cobrir endpoints principais do backend e fluxos críticos do pipeline.
   - Incluir testes de regressão para eventos, validação e dashboard.

10. Aumentar resiliência do pipeline
   - Tratar falhas de rede, processamento e persistência sem interromper todo o fluxo.
   - Adicionar retries, timeouts e recuperação básica de erros.

11. Preparar suporte a múltiplas fontes de vídeo
   - Projetar a arquitetura para aceitar mais de uma fonte de vídeo e múltiplos fluxos simultâneos.

### P3 — Evolução de produto

12. Aprimorar dashboard e validação
   - Tornar a interface mais operável para supervisão e revisão de eventos.
   - Melhorar experiência de uso para operadores.

13. Criar auditoria e histórico operacional
   - Registrar quem aprovou ou rejeitou eventos e quando.
   - Facilitar rastreabilidade e governança.

14. Expandir regras de análise e cenários de negócio
   - Ampliar a capacidade do motor de regras para cenários mais próximos do uso real.

## Ordem recomendada de execução

1. Configuração externa e segurança.
2. Autenticação e modelo de tenancy.
3. Desacoplamento entre visão e backend.
4. Observabilidade e testes iniciais.
5. Organização arquitetural e migrações de banco.

## Resumo executivo

O projeto já possui uma base de MVP funcional, mas precisa de maturação arquitetural antes de estar pronto para operação mais robusta, segurança comercial e escalabilidade. O próximo passo mais valioso é fortalecer a camada de infraestrutura operacional e segurança, seguido do desacoplamento do fluxo de eventos.

## Status atual

- Sprint Central de Validação concluída com sucesso parcial: o fluxo principal de geração, persistência e retorno de eventos para validação foi estabilizado.
- O pipeline agora produz eventos com snapshot e vídeo anexados, e a persistência no backend mantém esses campos para consumo do dashboard e da validação.
- A próxima fase recomendada é consolidar configuração por ambiente, observabilidade e autenticação.

## Próxima sprint — Sprint 1: Fundação operacional

### Objetivo da sprint

Consolidar a base operacional do projeto para reduzir riscos de execução, facilitar manutenção e preparar o caminho para evolução comercial.

### Escopo recomendado

1. Externalizar configuração e segredos
   - Definir variáveis de ambiente para banco, portas, CORS e integrações.
   - Remover dependência de valores fixos do código.

2. Melhorar saúde operacional do sistema
   - Definir endpoints de health check mais completos.
   - Adicionar logging estruturado básico para os fluxos principais.

3. Padronizar contratos de integração
   - Documentar o formato esperado de eventos enviados pela visão para o backend.
   - Definir respostas padrão para endpoints de eventos e validação.

4. Preparar base para autenticação e tenancy
   - Esboçar modelo de usuários, papéis e permissões por filial/câmera.
   - Identificar pontos de entrada que precisam de proteção.

### Itens priorizados para a sprint

- P0: Externalizar configuração e segredos.
- P0: Definir health checks e logging inicial.
- P1: Documentar contratos de API e eventos.
- P1: Definir modelo inicial de autenticação e permissões.

### Entregáveis esperados

- Configuração do sistema desacoplada do código.
- Visibilidade básica de status do backend e do pipeline.
- Documentação inicial de contratos e regras de acesso.
- Plano técnico para a próxima fase de autenticação e desacoplamento.

### Fora de escopo desta sprint

- Implementação completa de autenticação.
- Fila de mensageria robusta.
- Migrações complexas de banco.
- Expansão de regras de negócio ou produto.

### Critérios de sucesso

- O sistema pode ser configurado por ambiente sem alteração de código.
- O time consegue diagnosticar falhas básicas mais rapidamente.
- O fluxo de eventos e validação fica documentado de forma compreensível.
- A sprint gera um plano claro para os próximos incrementos arquiteturais.
