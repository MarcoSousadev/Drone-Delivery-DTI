#  Drone Delivery Simulator

Simulador de entregas com drones, aplicando regras de negócio reais de logística:  
- Capacidade máxima de 2.3kg por drone.  
- Priorização de entregas por **prioridade > peso > distância**.  
- Cálculo de rotas com Haversine e restrição de alcance.  
- Ciclo de simulação de estados do drone (**IDLE → IN_FLIGHT → RETURNING → IDLE**).  

---

##  Como executar

### Pré-requisitos
- **Node.js** 20+
- **npm** ou **yarn**
- **Docker** (opcional, caso queira rodar o Postgres com `docker-compose`)

### Instalação
```bash
git clone https://github.com/marcosousadev/drone_delivery_simulator.git
cd drone_delivery_simulator
npm install
```
### Subir banco com Docker
```bash
docker compose up -d
```
### Instalar Dependências
```bash
npm install
```
### Migrar banco
```bash
npm run migrate:dev
```
### Testes + cobertura
```bash
npm run test
```
