import type { FastifyInstance } from "fastify";
import { advanceSimulation } from "@/modules/simulation/controllers/advance-simulation.ts";
import { finishSimulation } from "@/modules/simulation/controllers/finish-simulation.ts";
import { startSimulation } from "@/modules/simulation/controllers/start-simulation-controller.ts";
import { dashboardReport, generateReport } from "@/modules/simulation/controllers/report-simulation.ts";

export async function appSimulationRoutes(app:FastifyInstance) {
  app.post('/simulation/start', startSimulation)
  app.post('/simulation/step', advanceSimulation)
  app.post('/simulation/finish', finishSimulation)
  app.get('/simulation/report', generateReport)
  app.get("/simulation/dashboard", dashboardReport)
}