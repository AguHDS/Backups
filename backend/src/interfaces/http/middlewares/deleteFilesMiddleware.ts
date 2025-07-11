import { Request, Response, NextFunction } from "express";

export const deleteFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  if (!Array.isArray(payload) || payload.length === 0) {
    res.status(400).json({ error: "Payload must be a non-empty array" });
    return;
  }

  for (const item of payload) {
    if (
      typeof item !== "object" ||
      typeof item.sectionId !== "number" ||
      !Array.isArray(item.publicIds) ||
      item.publicIds.length === 0 ||
      item.publicIds.some(id => typeof id !== "string" || id.trim() === "")
    ) {
      res.status(400).json({ error: "Each item must have a numeric sectionId and a non-empty array of publicIds (strings)" });
      return;
    }
  }

  next();
};
