import { Router } from "express";
import { fhir } from "../fhirClient";
import { addTenantTag, resolvePatientReference } from "../utils/fhir";

const router = Router();

router.post("/", async (req, res, next) => {
	try {
		const orgId = (req as any).orgId;
		const obs = addTenantTag(req.body, orgId);
		if (obs.subject?.reference && !obs.subject.reference.startsWith('Patient/')) {
			const id = await resolvePatientReference(obs.subject.reference, fhir.get.bind(fhir), orgId);
			obs.subject.reference = `Patient/${id}`;
		}
		const r = await fhir.post("/Observation", obs);
		res.status(r.status).json(r.data);
	} catch (err) {
		next(err);
	}
});

router.get("/", async (req, res) => {
	const orgId = (req as any).orgId;
	const r = await fhir.get("/Observation", {
		params: { _tag: `https://example.org/tenant|${orgId}`, patient: (req.query as any).patient }
	});
	res.json(r.data);
});

export default router; 