import { Request, Response } from "express";
import asyncHandler from "../../utils/common/asyncHandler";
import { successResponse } from "../../utils/serverresponse/successresponse";
import { AgentService } from "../agent/agent.service";



export const agentController = {
    getCommissionHistory: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      // Optionally return 401 or throw an error if user is missing
      throw new Error("Unauthorized: User not found in request.");
    }

    const userId = req.user.id;
    const result = await AgentService.getCommissionHistory(userId);

    return successResponse(
      res,
      result,
      "Commission history retrieved successfully"
    );
  }),
}