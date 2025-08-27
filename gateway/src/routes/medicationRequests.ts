import { Router } from "express";
import { fhir } from "../fhirClient";
import { addTenantTag, filterByTenantQuery, resolvePatientReference } from "../utils/fhir";

const router = Router();

router.post("/", async (req, res, next) => {
	try {
		const orgId = (req as any).orgId;
		const mr = addTenantTag(req.body, orgId);
		if (mr.subject?.reference && !mr.subject.reference.startsWith('Patient/')) {
			const id = await resolvePatientReference(mr.subject.reference, fhir.get.bind(fhir), orgId);
			mr.subject.reference = `Patient/${id}`;
		}
		const r = await fhir.post("/MedicationRequest", mr);
		res.status(r.status).json(r.data);
	} catch (err) {
		next(err);
	}
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