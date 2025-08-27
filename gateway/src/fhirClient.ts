import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env['FHIR_BASE'] || process.env['HAPI_URL'] || 'http://localhost:8080/fhir';

export const fhir = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/fhir+json" }
}); 