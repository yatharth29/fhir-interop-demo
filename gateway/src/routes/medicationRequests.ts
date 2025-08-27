import { Router } from "express";
import { fhir } from "../fhirClient";
import { addTenantTag, filterByTenantQuery } from "../utils/fhir";

const router = Router();

router.post("/", async (req, res) => {
	const orgId = (req as any).orgId;
	const mr = addTenantTag(req.body, orgId);
	const r = await fhir.post("/MedicationRequest", mr);
	res.status(r.status).json(r.data);
});

router.get("/", async (req, res) => {
	const orgId = (req as any).orgId;
	const q = filterByTenantQuery(orgId);
	const r = await fhir.get("/MedicationRequest", { params: q });
	res.json(r.data);
});

router.get("/:id", async (req, res) => {
	const r = await fhir.get(`/MedicationRequest/${req.params.id}`);
	res.json(r.data);
});

export default router; 