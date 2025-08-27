import axios from "axios";
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3001" });

export function listPatients(orgId: string) {
  // add cache-buster to avoid any intermediary 304s
  return api.get("/api/patients", { headers: { "X-Org-Id": orgId }, params: { _ts: Date.now() } });
}
export function createPatient(orgId: string, patient: any) {
  return api.post("/api/patients", patient, { headers: { "X-Org-Id": orgId } });
}
export function createObservation(orgId: string, obs: any) {
  return api.post("/api/observations", obs, { headers: { "X-Org-Id": orgId } });
}
export function createCondition(orgId: string, condition: any) {
  return api.post("/api/conditions", condition, { headers: { "X-Org-Id": orgId } });
}
export function createMedicationRequest(orgId: string, mr: any) {
  return api.post("/api/medication-requests", mr, { headers: { "X-Org-Id": orgId } });
}
export function getPatient(orgId: string, id: string) {
  return api.get(`/api/patients/${id}`, { headers: { "X-Org-Id": orgId }, params: { _ts: Date.now() } });
}
export function deletePatient(orgId: string, id: string) {
  return api.delete(`/api/patients/${id}`, { headers: { "X-Org-Id": orgId } });
}
export default api; 