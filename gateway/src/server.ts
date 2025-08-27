import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/error';
import { withTenant } from './middleware/tenant';

import patientRoutes from './routes/patients';
import observationRoutes from './routes/observations';
import conditionRoutes from './routes/conditions';
import medicationRequestRoutes from './routes/medicationRequests';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('combined'));
// Disable caching for API responses to ensure fresh data
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Require tenant on API routes
app.use('/api/:resource', withTenant, (_req, _res, next) => next());

// Routes
app.use('/api/patients', withTenant, patientRoutes);
app.use('/api/observations', withTenant, observationRoutes);
app.use('/api/conditions', withTenant, conditionRoutes);
app.use('/api/medication-requests', withTenant, medicationRequestRoutes);

// Health endpoints
app.get('/health', (_req, res) => {
	res.json({ status: 'healthy', service: 'fhir-gateway', ts: new Date().toISOString() });
});

app.get('/fhir/metadata', (_req, res) => {
	res.json({ resourceType: 'CapabilityStatement', status: 'active', date: new Date().toISOString(), fhirVersion: '4.0.1' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});

app.listen(Number(PORT), () => {
	console.log(`Gateway on http://localhost:${PORT}`);
});

export default app; 