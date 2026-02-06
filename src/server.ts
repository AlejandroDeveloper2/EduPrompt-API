import express, { Application, Router } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import http from "http";
import { Server as IOServer } from "socket.io";

import { config } from "@/config/enviromentVariables";

import { Feature } from "@/core/infrastructure/types";
import { setSocketInstance } from "@/core/infrastructure/socket/SocketInstance";
import { MongoDBConnectionAdapter } from "@/core/infrastructure/database";
import { errorHandler } from "@/core/infrastructure/middlewares/errorHandler.middleware";

/** Configuración de nuestro servidor de express */
class Server {
  private readonly server: Application = express();
  private httpServer?: http.Server;
  private io?: IOServer;
  private dbConector = new MongoDBConnectionAdapter();

  /** Inicializa la app con middlewares, dependencias y rutas */
  private async init(): Promise<void> {
    /** Conectar a base de datos */
    await this.dbConector.connectToDatabase();

    /** Inicializar middlewares globales */
    this.initializeMiddlewares();

    /** Registrar rutas de cada feature */
    await this.loadFeatures();

    /** Error handler global */
    this.initializeErrorHandler();
  }

  /** Función para arrancar el servidor */
  public async start(): Promise<void> {
    try {
      await this.init();

      // Crear servidor HTTP y Socket.IO
      this.httpServer = http.createServer(this.server);
      this.io = new IOServer(this.httpServer, {
        cors: { origin: "*" },
      });

      // Registrar globalmente
      setSocketInstance(this.io);

      // Cargar sockets de las features
      await this.registerFeatureSockets();

      this.httpServer.listen(config.PORT, () => {
        console.log(`✅ Server running on port ${config.PORT}`);
      });
    } catch (error) {
      console.log("Error starting the server:", error);
    }
  }

  /** Inicializa los middlewares de express */
  private initializeMiddlewares() {
    this.server.use(cors({ origin: "*" }));
    this.server.use(express.urlencoded({ extended: true }));
    // this.server.use(cookieParser());
    this.server.use(express.json());
  }

  /** Función para autocargar features y crear las rutas o endpoints de la API*/
  private async loadFeatures(): Promise<void> {
    const featuresPath = path.join(__dirname, "features");
    const featureDirs = fs.readdirSync(featuresPath);

    for (const dir of featureDirs) {
      const extension = config.NODE_ENV === "production" ? "js" : "ts";
      const indexPath = path.join(featuresPath, dir, `index.${extension}`);

      // Verificar que exista el archivo index.ts (por si hay carpetas vacías)
      if (!fs.existsSync(indexPath)) continue;

      try {
        const featureModule: Feature<unknown, unknown> = await import(
          indexPath
        );

        // Busca un export que termine en 'Feature'
        const exportedFeature: Feature<unknown, unknown> = Object.values(
          featureModule,
        ).find((f: Feature<unknown, unknown>) => f?.featureName && f?.router);

        if (exportedFeature) {
          const { featureName, router } = exportedFeature as {
            featureName: string;
            router: Router;
          };

          this.server.use(`/api/v1/${featureName}`, router);
          console.log(
            `✅ Feature '${featureName}' loaded at /api/v1/${featureName}`,
          );
        }
      } catch (error) {
        console.error(`❌ Error loading feature '${dir}':`, error);
      }
    }
  }

  /** Carga automática de sockets por feature */
  private async registerFeatureSockets(): Promise<void> {
    const featuresPath = path.join(__dirname, "features");
    const featureDirs = fs.readdirSync(featuresPath);

    for (const dir of featureDirs) {
      const extension = config.NODE_ENV === "production" ? "js" : "ts";
      const socketPath = path.join(featuresPath, dir, `index.${extension}`);
      if (!fs.existsSync(socketPath)) continue;

      try {
        const featureModule: Feature<unknown, unknown> = await import(
          socketPath
        );

        // Busca un export que tenga propiedad 'socket'
        const feature = Object.values(featureModule).find(
          (f: Feature<unknown, unknown>) => f?.socket,
        ) as { socket?: (io: IOServer) => void };

        if (feature?.socket && this.io) {
          feature.socket(this.io);
          console.log(`🟢 Socket registrado para feature '${dir}'`);
        } else {
          console.log(`⚪ Feature '${dir}' no define socket (omitido)`);
        }
      } catch (error) {
        console.error(`❌ Error al registrar socket para '${dir}':`, error);
      }
    }
  }

  /** Inicializa el errorHandler global */
  private initializeErrorHandler(): void {
    this.server.use(errorHandler);
  }
}

export const server = new Server();
