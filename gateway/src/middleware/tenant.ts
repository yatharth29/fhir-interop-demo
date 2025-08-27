import { Request, Response, NextFunction } from "express";

/**
 * Reads X-Org-Id header to determine current hospital.
 * Falls back to query ?orgId=.
 */
export function withTenant(req: Request, res: Response, next: NextFunction): void {
	const orgId = (req.header("X-Org-Id") || (req.query as any).orgId || "").toString();
	if (!orgId) {
		res.status(400).json({ error: "Missing orgId (X-Org-Id header or ?orgId=)" });
		return;
	}
	(req as any).orgId = orgId;
	next();
} 