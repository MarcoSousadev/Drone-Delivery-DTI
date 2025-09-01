// src/modules/delivery/usecases/assign-delivery.ts
import type { OrdersRepository } from "../../orders/repositories/ordersRepository.ts";
import type { DronesRepository } from "../../drones/repositories/drones-repository.ts";
import type { DeliveryRepository } from "../repository/delivery-repository.ts";
import { PriorityQueue } from "@/core/queue/priorityQueue.ts";
// ATENÇÃO: garanta que o caminho/nome batem com seu utils (route-distance.ts exporta routeDistanceKm)
import { routeDistanceKm } from "@/core/utils/routeDistance.ts";

type Input = { orderId: string };
type DeliveryDTO = { id: string; droneId: string; startedAt: Date; finishedAt: Date | null };
export type AssignDeliveryUseCaseResponse = { delivery: DeliveryDTO };

const DRONE_CAPACITY_KG = 2.3;
const DEFAULT_RANGE_KM = 12;

const asNumber = (v: any) =>
  v == null ? 0 : typeof v === "number" ? v : typeof v.toNumber === "function" ? v.toNumber() : Number(v);

export class AssignDeliveryUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly dronesRepository: DronesRepository,
    private readonly deliveryRepository: DeliveryRepository
  ) {}

  public async execute({ orderId }: Input): Promise<AssignDeliveryUseCaseResponse> {
    // 1) Pedido principal
    const main = await this.ordersRepository.findById(orderId);
    if (!main) throw new Error("Pedido não encontrado");
    if (main.status !== "PENDING") throw new Error("Pedido não está disponível para entrega");

    const mainWeight = asNumber(main.packageWeight);
    if (mainWeight > DRONE_CAPACITY_KG) {
      throw new Error(`Peso do pedido (${mainWeight} kg) excede capacidade (${DRONE_CAPACITY_KG} kg)`);
    }

    // 2) Drone disponível
    const drone = await this.dronesRepository.findFirstAvailable();
    if (!drone) throw new Error("Nenhum drone disponível no momento");

    // base e autonomia (troque para campos reais do seu Drone se existir)
    const base = {
      latitude: asNumber((drone as any).baseLatitude),
      longitude: asNumber((drone as any).baseLongitude),
    };
    const rangeKm = asNumber((drone as any).rangeKm ?? DEFAULT_RANGE_KM);

    // 3) Candidatos para completar a rota (usa seu método já existente)
    //    Pelo que você disse, esse findManyPending(id) já retorna pendentes excluindo o id informado.
    const pool = await this.ordersRepository.findManyPending(main.id);

    // ordena por prioridade > peso > proximidade (sua PriorityQueue)
    const pq = new PriorityQueue(base.latitude, base.longitude);
    const sorted = pq.sort(pool);

    // 4) Seleção gulosa respeitando peso + alcance
    const chosen = [main];
    let totalWeight = mainWeight;

    // valida alcance só com o pedido principal
    const singleDist = routeDistanceKm(base, [
      { latitude: asNumber(main.latitude), longitude: asNumber(main.longitude) },
    ]);
    if (singleDist > rangeKm) {
      throw new Error(`Rota do pedido principal excede o alcance (${singleDist.toFixed(2)} km > ${rangeKm} km)`);
    }

    for (const o of sorted) {
      const w = asNumber(o.packageWeight);
      if (w <= 0) continue;
      if (totalWeight + w > DRONE_CAPACITY_KG) continue;

      const stops = [...chosen, o].map((x) => ({
        latitude: asNumber(x.latitude),
        longitude: asNumber(x.longitude),
      }));

      const tripDist = routeDistanceKm(base, stops);
      if (tripDist > rangeKm) continue;

      chosen.push(o);
      totalWeight += w;
    }

    // 5) Criar delivery (repo encapsula Prisma e faz connect)
    const created = await this.deliveryRepository.create({
      droneId: drone.id,
      orderIds: chosen.map((o) => o.id),
      startedAt: new Date(),
    });

    // 6) Atualizar estados
    for (const o of chosen) {
      await this.ordersRepository.updateStatus(o.id, "ALLOCATED"); // troque para "ASSIGNED" se preferir
    }
    await this.dronesRepository.updateStatus(drone.id, "LOADING");

    // 7) DTO de retorno
    const delivery: DeliveryDTO = {
      id: created.id,
      droneId: created.droneId,
      startedAt: created.startedAt,
      finishedAt: created.finishedAt ?? null,
    };

    return { delivery };
  }
}
