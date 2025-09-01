import type { FastifyRequest, FastifyReply } from "fastify";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaDeliveryRepository } from "@/modules/delivery/repository/prisma-delivery-repository.ts";
import { renderAsciiDeliveriesMap, type DeliveryPoint } from "@/core/utils/asciiMap.ts";
import { GenerateReportUseCase } from "../usecases/generete-report-usecase.ts";


async function loadTemplate(): Promise<string> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(here, "../views/dashboard.html");
  return await readFile(templatePath, "utf-8");
}

function fillTemplate(html: string, data: Record<string, string>) {
  let out = html;
  for (const [key, value] of Object.entries(data)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}


export async function generateReport(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository();
    const generateReportUseCase = new GenerateReportUseCase(prismaDeliveryRepository);

    const report = await generateReportUseCase.execute();
    return reply.status(200).send(report);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Unexpected error" });
  }
}


export async function dashboardReport(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaDeliveryRepository = new PrismaDeliveryRepository();
    const generateReportUseCase = new GenerateReportUseCase(prismaDeliveryRepository);

    const report = await generateReportUseCase.execute();
    const deliveries = await prismaDeliveryRepository.findAllCompletedWithDroneAndOrders();

    const points: DeliveryPoint[] = [];
    for (const delivery of deliveries) {
  
      points.push({
        kind: "BASE",
        droneId: delivery.droneId,
        latitude: delivery.drone.baseLatitude,
        longitude: delivery.drone.baseLongitude,
      });
    
      for (const order of delivery.orders) {
        points.push({
          kind: "ORDER",
          deliveryId: delivery.id,
          droneId: delivery.droneId,
          latitude: order.latitude,
          longitude: order.longitude,
        });
      }
    }

    const asciiMap = renderAsciiDeliveriesMap(points, { width: 72, height: 22 });

    const template = await loadTemplate();
    const html = fillTemplate(template, {
      deliveriesCount: String(report.deliveriesCount),
      avgDeliveryMinutes: report.avgDeliveryMinutes.toFixed(1),
      topDroneId: report.topDroneId ?? "-",
      totalKm: report.totalKm.toFixed(2),
      totalWeightKg: report.totalWeightKg.toFixed(2),
      asciiMap: asciiMap.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      droneRows: report.droneRanking.map((d) => `
        <tr>
          <td>${d.droneId}</td>
          <td>${d.trips}</td>
          <td>${d.totalKm.toFixed(2)}</td>
          <td>${d.avgKmPerTrip.toFixed(2)}</td>
          <td>${d.totalWeightKg.toFixed(2)}</td>
          <td>${d.totalDurationMin.toFixed(1)}</td>
        </tr>
      `).join(""),
    });

    return reply.type("text/html").status(200).send(html);
  } catch (err: any) {
    return reply.status(500).send({ message: err?.message ?? "Unexpected error" });
  }
}
