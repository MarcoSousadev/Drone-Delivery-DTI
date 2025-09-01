Fila de prioridade / PriorityQueue
Pedi ordenação por prioridade, depois peso e depois distância da base com tie-breakers.
Decisão: Implementado com comparador dedicado; testes unit garantem estabilidade e pesos.

Cálculo de distância
Pedi Haversine + rota com ida e volta.
Decisão: haversineKm + routeDistanceKm(base, stops) com throw se exceder alcance (12km default, drone.rangeKm override).

Repository pattern + Use Cases
Pedi a separação de camadas e injeção via construtor.
Decisão: Interfaces para repos, implementações Prisma/InMemory; use cases sem Prisma direto.

FSM de simulação
Pedi estados de drone e como transicionar por step.
Decisão: AdvanceSimulationUseCase transita IDLE→IN_FLIGHT→RETURNING→IDLE; fecha deliveries, marca orders delivered, atualiza drone status.

Relatório & dashboard
Pedi métricas e renderização simples (ASCII/HTML).
Decisão: GenerateReportUseCase agrega métricas; controller devolve JSON e HTML com template separado.


