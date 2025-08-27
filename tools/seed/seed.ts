import axios from "axios";
const base = "http://localhost:3001";

async function createOrg(orgId: string, name: string) {
  // Ensure Organization exists in FHIR (once)
  await axios.post("http://localhost:8080/fhir/Organization", {
    resourceType: "Organization",
    id: orgId,
    name
  }, { headers: { "Content-Type": "application/fhir+json" } }).catch(()=>{});
}

async function main() {
  await createOrg("HOSP-A", "General Hospital A");
  await createOrg("HOSP-B", "Community Hospital B");

  const patient = {
    resourceType: "Patient",
    name: [{ family: "Verma", given: ["Ravi"] }],
    gender: "male",
    birthDate: "1990-01-01"
  };

  const pa = await axios.post(`${base}/api/patients`, patient, { headers: { "X-Org-Id": "HOSP-A" } });
  const patientId = pa.data.id;

  await axios.post(`${base}/api/observations`, {
    resourceType: "Observation",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure panel" }] },
    subject: { reference: `Patient/${patientId}` },
    component: [
      { code: { coding: [{ code: "8480-6", display: "Systolic" }] }, valueQuantity: { value: 140, unit: "mmHg" } },
      { code: { coding: [{ code: "8462-4", display: "Diastolic" }] }, valueQuantity: { value: 92, unit: "mmHg" } }
    ]
  }, { headers: { "X-Org-Id": "HOSP-A" } });

  // Interoperability: read from Hospital B – same patient list via shared FHIR backend
  const listB = await axios.get(`${base}/api/patients`, { headers: { "X-Org-Id": "HOSP-B" } });
  console.log("Hospital B sees patients (should be empty if filtering strictly by tenant tag):",
              listB.data.total);

  // Demonstrate shared access by removing strict filter (optional) or using consent rules in a real system.
}
main(); 