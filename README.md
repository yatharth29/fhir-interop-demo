# FHIR Interoperability Demo

A comprehensive demonstration of FHIR (Fast Healthcare Interoperability Resources) interoperability between multiple hospitals using a TypeScript gateway and Next.js web application.

## 🏥 Overview

This demo showcases how different hospitals can share and manage healthcare data through a centralized FHIR gateway while maintaining data isolation through hospital-specific tagging. The system includes:

- **HAPI FHIR Server**: Standards-compliant FHIR R4 server with PostgreSQL backend
- **TypeScript Gateway**: Express.js proxy with hospital tenant isolation
- **Next.js Web App**: Modern React-based user interface
- **Multi-tenant Architecture**: Hospital-specific data segregation
- **Docker Compose**: Complete infrastructure orchestration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App      │    │   Gateway      │    │   HAPI FHIR    │
│  (Next.js)     │◄──►│  (TypeScript)  │◄──►│    Server      │
│  Port 3000     │    │  Port 3001     │    │   Port 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL   │
                       │   Port 5432    │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd fhir-interop-demo
```

### 2. Start the Infrastructure

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### 3. Wait for Services to Start

The services will start in this order:
1. PostgreSQL database
2. HAPI FHIR server
3. Gateway server
4. Web application

You can monitor the startup process with:
```bash
docker-compose logs -f
```

### 4. Access the Application

- **Web Application**: http://localhost:3000
- **Gateway API**: http://localhost:3001
- **HAPI FHIR**: http://localhost:8080
- **Health Check**: http://localhost:3001/health

## 🏥 Hospital Configuration

The demo includes three sample hospitals:

| Hospital ID | Name                    | Description           |
|-------------|-------------------------|-----------------------|
| HOSP-A      | General Hospital A      | Main demonstration hospital |
| HOSP-B      | Community Medical Center B | Secondary hospital |
| HOSP-C      | Regional Health Center C | Tertiary hospital |

## 📊 Available FHIR Resources

### Patients
- **GET** `/api/patients` - List all patients for a hospital
- **GET** `/api/patients/:id` - Get specific patient
- **POST** `/api/patients` - Create new patient
- **PUT** `/api/patients/:id` - Update patient
- **DELETE** `/api/patients/:id` - Delete patient

### Observations
- **GET** `/api/observations` - List all observations
- **POST** `/api/observations` - Create new observation

### Conditions
- **GET** `/api/conditions` - List all conditions
- **POST** `/api/conditions` - Create new condition

### Medication Requests
- **GET** `/api/medication-requests` - List all medication requests
- **POST** `/api/medication-requests` - Create new medication request

## 🔐 Authentication & Authorization

All API requests require hospital identification through headers:

```bash
curl -H "x-hospital-id: HOSP-A" \
     -H "x-hospital-name: General Hospital A" \
     http://localhost:3001/api/patients
```

## 🧪 Testing

### Using Postman

1. Import the collection: `tools/postman/FHIR-Interop.postman_collection.json`
2. Set environment variables:
   - `baseUrl`: http://localhost:3001
   - `hapiUrl`: http://localhost:8080
   - `hospitalId`: HOSP-A
   - `hospitalName`: General Hospital A

### Using cURL

```bash
# Get patients for Hospital A
curl -H "x-hospital-id: HOSP-A" \
     -H "x-hospital-name: General Hospital A" \
     http://localhost:3001/api/patients

# Create a new patient
curl -X POST \
     -H "x-hospital-id: HOSP-A" \
     -H "x-hospital-name: General Hospital A" \
     -H "Content-Type: application/json" \
     -d '{
       "resourceType": "Patient",
       "identifier": [{"system": "http://hospital-system/patient", "value": "PAT-005"}],
       "name": [{"use": "official", "family": "Wilson", "given": ["David"]}],
       "gender": "male",
       "birthDate": "1988-03-20"
     }' \
     http://localhost:3001/api/patients
```

## 🌱 Seeding Demo Data

Populate the system with sample data:

```bash
# Navigate to tools directory
cd tools/seed

# Install dependencies
npm install

# Run the seed script
npm run seed
```

This will create:
- 3 sample patients per hospital
- Vital signs observations
- Medical conditions
- Medication requests

## 🛠️ Development

### Local Development Setup

#### Gateway

```bash
cd gateway
npm install
npm run dev
```

#### Web Application

```bash
cd web
npm install
npm run dev
```

### Environment Variables

#### Gateway (.env)
```bash
PORT=3001
NODE_ENV=development
HAPI_URL=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Web Application (.env.local)
```bash
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

### Building for Production

```bash
# Gateway
cd gateway
npm run build
npm start

# Web Application
cd web
npm run build
npm start
```

## 📁 Project Structure

```
fhir-interop-demo/
├── README.md                 # This file
├── docker-compose.yml        # Infrastructure orchestration
├── infra/                    # Infrastructure configuration
│   ├── hapi/                # HAPI FHIR server config
│   └── init-sql/            # Database initialization
├── gateway/                  # TypeScript Express gateway
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── tests/           # Test files
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
├── web/                      # Next.js web application
│   ├── src/
│   │   ├── pages/           # Next.js pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API client library
│   │   └── styles/          # CSS and styling
│   ├── package.json
│   ├── Dockerfile
│   └── next.config.js
└── tools/                    # Development and testing tools
    ├── seed/                 # Database seeding script
    └── postman/              # Postman collection
```

## 🔍 Monitoring & Debugging

### Health Checks

- **Gateway**: http://localhost:3001/health
- **HAPI FHIR**: http://localhost:8080/fhir/metadata

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs gateway
docker-compose logs hapi
docker-compose logs web

# Follow logs in real-time
docker-compose logs -f
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U hapi -d hapi

# View tables
\dt

# Sample query
SELECT * FROM hospitals;
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, 8080, and 5432 are available
2. **Service startup order**: Wait for PostgreSQL to be healthy before other services
3. **Memory issues**: Ensure Docker has sufficient memory allocated (4GB+ recommended)

### Reset Everything

```bash
# Stop and remove all containers
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

### Check Service Status

```bash
# View running containers
docker-compose ps

# Check service health
docker-compose exec gateway npm run health
docker-compose exec hapi curl -f http://localhost:8080/fhir/metadata
```

## 📚 Additional Resources

- [FHIR Specification](https://www.hl7.org/fhir/)
- [HAPI FHIR Documentation](https://hapifhir.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Open an issue in the repository
4. Check the FHIR community forums

---

**Note**: This is a demonstration system and should not be used in production environments without proper security, authentication, and compliance measures. 