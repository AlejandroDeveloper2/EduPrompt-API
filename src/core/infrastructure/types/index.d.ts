import { Request, Router } from "express";
import { Server } from "socket.io";

import { DecodedToken } from "@/core/domain/types";

interface Feature<R, S> {
  featureName: string;
  router: Router;
  repository: R;
  service: S;
  socket?: (io: Server) => void;
}

interface RequestExtended extends Request {
  user?: DecodedToken;
}

export { Feature, ServerResponse, RequestExtended };
