export function addTenantTag(resource: any, orgId: string) {
	resource.meta = resource.meta || {};
	resource.meta.tag = resource.meta.tag || [];
	const already = resource.meta.tag.find((t: any) => t.system === "https://example.org/tenant" && t.code === orgId);
	if (!already) {
		resource.meta.tag.push({ system: "https://example.org/tenant", code: orgId, display: `Hospital ${orgId}` });
	}
	return resource;
}

export function setSubjectToOrg(resource: any, orgId: string) {
	// Example: store managing Organization link when applicable
	resource.managingOrganization = { reference: `Organization/${orgId}` };
	return resource;
}

export function filterByTenantQuery(orgId: string) {
	// HAPI supports tag search: _tag=<system>|<code>
	return { _tag: `https://example.org/tenant|${orgId}` };
} 

export async function resolvePatientReference(input: string, fhirGet: (path: string, config?: any) => Promise<any>, orgId?: string): Promise<string> {
	// If it already looks like a Patient reference, strip prefix
	if (input.startsWith('Patient/')) {
		return input.split('/')[1];
	}
	// If it looks like a FHIR id (token pattern), try direct read
	if (/^[A-Za-z0-9\-.]{1,64}$/.test(input)) {
		try {
			const direct = await fhirGet(`/Patient/${input}`);
			if (direct?.data?.id) return direct.data.id;
		} catch (_e) {
			// fall through to identifier search
		}
	}
	// Try identifier search with known system
	const system = 'http://hospital-system/patient';
	const tries = [
		`${system}|${input}`,
		input
	];
	for (const token of tries) {
		const params: any = { identifier: token };
		if (orgId) {
			params._tag = `https://example.org/tenant|${orgId}`;
		}
		const r = await fhirGet('/Patient', { params });
		const entry = (r.data?.entry || [])[0];
		if (entry?.resource?.id) {
			return entry.resource.id;
		}
	}
	throw new Error('Patient not found for identifier');
}