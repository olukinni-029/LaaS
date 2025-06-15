import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import { createServer } from "http";
import { connectToMongoDB } from "../src/config/dbConnection";
import logger from "./utils/logger";
import { setupErrorHandlers } from "./middlewares/global_errorHandlers";
import { setupErrorHandling } from "./middlewares/errorhandling_signal_middleware";
import "./utils/common/eventListener";
import "./utils/common/repayment.scheduler";
import { setupSocketIO } from "./utils/socket";
import rootRouter from "./index.route";
import { setupMiddleware } from './middlewares/setup_middleware';

const app: Express = express();

app.use(express.json());

setupMiddleware(app)

connectToMongoDB();


app.get("/", (_req, res) => {
  res.send("LaaS API is live!");
});

// === Create HTTP server ===
const httpServer = createServer(app);
app.use('/api/v1',rootRouter);
setupErrorHandlers(app);


const PORT = process.env.PORT || 5000;

const server = httpServer.listen(PORT, () => {
  logger.info(
    `Prometheus metrics are available at http://localhost:${PORT}/metrics`
  );
  logger.info(
    `Server is live on http://localhost:${PORT} - PID: ${process.pid} - ENV: ${process.env.NODE_ENV}`
  );
});

setupErrorHandling(server);

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    logger.info("Server is closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Export for use in event listeners
export { server };
