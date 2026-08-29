# 🌊 BlueTrace — Blockchain-Based Blue Carbon Registry & MRV System

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet_GIS-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**BlueTrace** is an end-to-end decentralized Blue Carbon Registry and automated Measurement, Reporting & Verification (MRV) platform for coastal restoration ecosystems (Mangroves, Seagrass Meadows, Salt Marshes, Coastal Wetlands, Kelp Forests, and Tidal Estuaries).

---

## 🏛️ System Architecture & Workflow

```
                                  ┌──────────────────────────────┐
                                  │   Browser LocalStorage DB    │ (Instant client-side cache &
                                  │ (bluetrace_registry_db_v1)   │  cross-tab state sync)
                                  └──────────────▲───────────────┘
                                                 │
                                                 │ Reads / Writes
                                                 │
┌─────────────────────────┐       ┌──────────────┴───────────────┐       ┌─────────────────────────┐
│   Next.js UI Frontend   │ <---> │   Registry Store Controller  │ <---> │   Next.js REST API DB   │
│ (Owner / Officer / Ver) │       │ (src/lib/store/registryStore)│       │ (GET/POST /api/projects)│
└─────────────────────────┘       └──────────────┬───────────────┘       └────────────┬────────────┘
                                                 │                                    │
                                                 ▼ Reads / Writes                     ▼ Reads / Writes
                                  ┌────────────────────────────────────────────────────────────────┐
                                  │            Server Filesystem Persistent Database               │
                                  │                  (data/bluetrace_db.json)                      │
                                  └────────────────────────────────────────────────────────────────┘
```

---

## 🌿 3-Stage Credit Review & Issuance Pipeline

1. **Stage 1: Project Owner Submission (`/developer`)**:
   - Register any coastal restoration plot (Mangrove, Seagrass, Salt Marsh, Wetlands, Kelp, Estuaries).
   - Interactive **Location Scaling Slider** ($0.5\times$ to $3.0\times$ spread multiplier) with live Google Satellite GIS polygon boundary rendering.
   - Device GPS Auto-Detection and coordinate boundary editing.
   - Ingest drone LiDAR point clouds, Sentinel-2 multispectral NDVI indices, and soil core TOC chromatography.
   - Automatic execution of IPCC Tier-2 and Verra VM0033 allometric carbon accounting models.

2. **Stage 2: Field Officer Ground-Truth Inspection (`/field-officer`)**:
   - Inspect plot boundary with handheld RTK DGPS ground-truthing.
   - Set canopy vigor score ($50\%\text{–}100\%$) and log physical soil core sample references.
   - **Stamp Approved** (advances project to Stage 3) or **Reject / Request Field Corrections** (sends back to Project Owner with discrepancy notes).

3. **Stage 3: Independent Verifier & Admin Audit (`/verifier`)**:
   - Audit Stage 2 field inspection reports and mathematical IPFS hash digests.
   - Verify Above-Ground ($AGB$), Root ($BGB$), and Sediment Organic Carbon ($SOC$) stocks.
   - **Sign On-Chain & Mint Credits** (issues tradeable BCT tokens into Developer's wallet with immutable serial range) or **Reject / Deny Issuance**.

---

## 🔬 Scientific MRV Measurement Protocol (IPCC VM0033)

$$\text{AGB} = 0.251 \times \rho \times (\text{DBH})^{2.46} \quad (\text{Carbon} = \text{AGB} \times 0.47)$$

$$\text{BGB} = \text{AGB} \times 0.49 \quad (\text{Carbon} = \text{BGB} \times 0.39)$$

$$\text{SOC} = \text{Depth (cm)} \times \text{Bulk Density} \times \text{SOC}\%$$

$$\text{Gross } tCO_2e = (C_{\text{total}} - C_{\text{baseline}}) \times \frac{44}{12} \times \text{Area (ha)}$$

$$\text{Net Issuable Credits (BCT)} = \text{Gross } tCO_2e \times 85\% \quad (15\% \text{ Permanence Buffer Locked})$$

---

## 🖨️ Clean Official Certificate Receipt Printing

- Printing credit retirement receipts (`/portfolio/retirements/[id]`) uses dedicated `@media print` CSS rules.
- Automatically strips out navigation bars, headers, footers, and web chrome.
- Formats only the **Official Certificate Canvas** for clean **A4 / Letter portrait printing** with QR verification code, on-chain burn transaction hash, and tamper-proof SHA-256 seal.

---

## 🔌 REST API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/projects` | `GET` | Retrieve all persistent projects from the database |
| `/api/projects` | `POST` | Register a new project and append to the database |
| `/api/holdings` | `GET` | Retrieve all active token batches and credit holdings |
| `/api/retirements` | `GET` | Retrieve all official retirement certificates |
| `/api/retirements` | `POST` | Permanently burn credits and generate a new certificate |
| `/api/transactions` | `GET` | Retrieve the global blockchain transaction ledger |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

```bash
# Clone repository
git clone https://github.com/vignesh90117/BlueTrace.git
cd BlueTrace

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐳 Docker Deployment

### Run with Docker Compose (Recommended)
```bash
# Build and launch container in detached mode
docker compose up --build -d

# View live container logs
docker compose logs -f

# Stop container
docker compose down
```

### Run with plain Docker CLI
```bash
# Build image
docker build -t bluetrace-registry:latest .

# Run container with persistent data volume
docker run -d -p 3000:3000 -v ${PWD}/data:/app/data --name bluetrace bluetrace-registry:latest
```

---

## 🛡️ License

Built for environmental integrity, high-durability coastal carbon sequestration, and Smart India Hackathon.
