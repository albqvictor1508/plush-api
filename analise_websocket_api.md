
## Implementação do WebSocket

O servidor WebSocket é inicializado em `src/core/index.ts` e o endpoint `/ws` é definido em `src/modules/ws/index.ts`. A implementação atual lida com o seguinte:

- **Conexão:** Aceita conexões WebSocket no endpoint `/ws`.
- **Recepção de Mensagens:** Ouve por mensagens dos clientes e as processa com base no `EventType`.
- **Manipuladores de Eventos:** O arquivo `src/common/ws.ts` define os manipuladores para os eventos recebidos dos clientes.

## O Problema: Conectando a API e o WebSocket

O principal problema é a **falta de comunicação unidirecional das rotas da API para os clientes WebSocket**. Quando uma nova mensagem ou chat é criado através de uma rota HTTP, não há um mecanismo para notificar os clientes conectados sobre essa atualização.

A implementação atual usa o Redis Streams para publicar eventos, mas não há um "consumidor" que leia esses eventos e os transmita para os clientes WebSocket.

## Solução Proposta

Para resolver esse problema, proponho a seguinte abordagem:

1.  **Centralizar o Gerenciamento de Clientes WebSocket:** Criar um gerenciador central para manter um registro de todos os clientes WebSocket conectados. Isso pode ser feito em um novo arquivo, por exemplo, `src/common/ws-manager.ts`.

2.  **Implementar uma Função de Transmissão (Broadcast):** No gerenciador de clientes, criar uma função `broadcast` que permita o envio de mensagens para todos os clientes conectados ou para um subconjunto deles (por exemplo, apenas para os participantes de um chat específico).

3.  **Criar um Consumidor de Eventos do Redis:** Implementar um consumidor que leia os eventos do Redis Streams (publicados pelas rotas da API) e use a função `broadcast` para enviar esses eventos aos clientes WebSocket relevantes.

4.  **Integrar o Consumidor à Aplicação:** Garantir que o consumidor de eventos do Redis seja iniciado junto com a aplicação.

Esta abordagem desacopla as rotas da API do servidor WebSocket, permitindo uma comunicação eficiente e escalável entre eles.
