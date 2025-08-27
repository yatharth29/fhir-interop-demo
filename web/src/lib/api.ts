import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:3001" });

export function listPatients(orgId: string) {
  return api.get("/api/patients", { headers: { "X-Org-Id": orgId } });
}
export function createPatient(orgId: string, patient: any) {
  return api.post("/api/patients", patient, { headers: { "X-Org-Id": orgId } });
}
export function createObservation(orgId: string, obs: any) {
  return api.post("/api/observations", obs, { headers: { "X-Org-Id": orgId } });
}
export default api; 