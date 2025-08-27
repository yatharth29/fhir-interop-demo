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