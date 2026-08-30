# 🌊 BlueTrace — Hackathon Pitch & Team Operations Playbook

> **Target Audience:** Hackathon Team Members, Presenters, and Live Demo Operators.  
> **Mission:** Zero-fluff, authoritative guide to operating BlueTrace, understanding the science & smart contracts, and answering jury questions with confidence.

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [End-to-End Live Demo Walkthrough (Jury Script)](#2-end-to-end-live-demo-walkthrough-jury-script)
3. [Key Concepts & Terminology Glossary](#3-key-concepts--terminology-glossary)
4. [Scientific MRV Mathematical Formulas (IPCC VM0033)](#4-scientific-mrv-mathematical-formulas-ipcc-vm0033)
5. [Role-Based Access Control (RBAC) System](#5-role-based-access-control-rbac-system)
6. [Blockchain & Smart Contract Architecture](#6-blockchain--smart-contract-architecture)
7. [Hackathon Jury FAQ & Defense Strategy](#7-hackathon-jury-faq--defense-strategy)
8. [Quick Command Cheatsheet for Live Demo](#8-quick-command-cheatsheet-for-live-demo)

---

## 1. Executive Summary & Problem Statement

### 🎯 The Problem
Traditional voluntary carbon markets for coastal ecosystems ("Blue Carbon") suffer from three fundamental flaws:
1. **Manual & Opaque MRV**: Field measurement relies on slow manual surveys taking 6–18 months with high human error and vulnerability to fraud.
2. **Double-Counting & Greenwashing**: The same carbon credits are frequently sold across multiple registries without cryptographic retirement proofs.
3. **High Intermediary Fees**: 40–60% of carbon credit revenue is captured by brokers, leaving coastal communities underfunded.

### 💡 The BlueTrace Solution
**BlueTrace** is an automated, decentralized Blue Carbon Registry and AI/Satellite-powered MRV system:
- **High Sequestration Focus**: Coastal wetlands (Mangroves, Seagrass, Salt Marshes) sequester carbon **up to 10x faster** and store it for millennia in anoxic sediments compared to terrestrial forests.
- **Deterministic 3-Stage Verification Pipeline**: Project Developer $\to$ Field Officer Ground-Truth $\to$ Independent ISO-14065 Auditor.
- **Multispectral Telemetry**: Ingests Sentinel-2 NDVI canopy imagery, drone LiDAR point clouds, and physical soil core chromatography.
- **On-Chain Tokenization (BCT)**: Deterministic minting with 15% permanence buffer locked into protocol risk reserves and zero-knowledge retirement certificates.

---

## 2. End-to-End Live Demo Walkthrough (Jury Script)

Follow this exact 4-Act scenario during your presentation.

### 🎬 Scenario: *"Registering, Verifying & Retiring 6,000+ Credits for a Sundarbans Mangrove Project"*

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     ACT 1       │       │     ACT 2       │       │     ACT 3       │       │     ACT 4       │
│  Project Owner  │ ────> │  Field Officer  │ ────> │   Verifier /    │ ────> │ Corporate Buyer │
│  Registration & │       │  Ground-Truth   │       │     Auditor     │       │  Purchase & A4  │
│  Scaling Slider │       │   Inspection    │       │  On-Chain Mint  │       │  Print Receipt  │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

### Act 1: Project Owner / Developer (`/developer`)
1. **Switch Role**: Top-right Role Switcher $\to$ Select **"1. Project Developer / Owner"**.
2. **Click "Register New Blue Carbon Plot"** (`/developer/projects/new`):
   - **Step 1 (Ecosystem & Identity)**:
     - Select Ecosystem: **Mangrove** (or Seagrass, Salt Marsh, Kelp Forest, Coastal Wetland, Tidal Estuary).
     - Title: `Sundarbans Tidal Mangrove Bio-Shield Project`.
     - Area: `185 Hectares`.
   - **Step 2 (Location & Boundary Scaling)**:
     - Click **"Detect My Current GPS"** to demonstrate device geolocation fix.
     - Center Coordinates: `21.8420°N, 88.8250°E`.
     - **Demonstrate the Location Scaling Slider**: Drag from `0.5x` (Tight core) to `2.0x` (Regional delta) — point out how the **Google Satellite GIS Map** updates the polygon boundary and recalculates coverage hectares in real-time!
   - **Step 3 (Methodology & Species)**:
     - Methodology: `VM0033 (Tidal Wetland Restoration)`.
     - Species: `Rhizophora mucronata, Avicennia marina, Ceriops decandra`.
     - Click **"Complete Registration & Save to Database"**.
3. **Upload Telemetry & Run MRV Engine** (`/developer/projects/[id]`):
   - Input DBH: `15.5 cm`, Density: `1,400 trees/ha`, Soil SOC: `3.6%`, Soil Depth: `100 cm`.
   - Click **"Run Automated MRV Calculation Engine"**.
   - Point out deterministic formula breakdown: Above-ground ($AGB$), Root ($BGB$), Sediment ($SOC$), and Net $tCO_2e$.
   - Submit project for Stage 2 review.

---

### Act 2: Field Officer Ground-Truth Inspection (`/field-officer`)
1. **Switch Role**: Select **"2. Field Officer"**.
2. **Select Project**: Select `Sundarbans Tidal Mangrove Bio-Shield Project` from the review queue.
3. **Inspect Handheld GIS Boundary**:
   - Check coordinates on Google Satellite view.
   - Verify canopy vigor score ($85\%$) and enter Soil Core Lab Ref (`CORE-SUND-2026-B8`).
   - Add field observation note: *"Ground-truth verified via handheld RTK DGPS. Healthy prop root network with high sediment siltation."*
4. **Action**: Click **"Stamp Field Officer Approval"**.
   - Show how the project status instantly updates to `field_approved` (Stage 2 Complete).

---

### Act 3: Independent Verifier & Smart Contract Minting (`/verifier`)
1. **Switch Role**: Select **"3. Independent Auditor / Verifier"**.
2. **Audit Stage 2 Attestation**:
   - Review the Field Officer's canopy score, soil core lab reference, and SHA-256 telemetry hash.
   - Point out the **MRV Calculation Proof Card** showing gross $CO_2e$ and the **15% Permanence Buffer deduction**.
3. **Action**: Click **"Approve & Execute Smart Contract Minting"**:
   - Executes simulated on-chain minting on Polygon.
   - Generates immutable Token Batch ID: `BCT-2026-V1-001` and serial range `BCR-IND-001-2026-B1-0001-8420`.
   - Credits are deposited directly into the Project Owner's custodial wallet.

---

### Act 4: Credit Buyer Purchase, Retirement & Clean A4 Print (`/portfolio`)
1. **Switch Role**: Select **"4. Credit Buyer / Corporate Trader"**.
2. **Inspect Holdings**:
   - Show active balance: `6,270.5 BCT` available.
3. **Retire Credits (Token Burn)**:
   - Enter Amount: `500 BCT`.
   - Retiring Entity: `Tata Global Sustainability & Climate Fund`.
   - Beneficiary / Purpose: `FY2026 Scope-3 Logistics Decarbonization`.
   - Click **"Permanently Burn & Generate Certificate"**.
   - Smart contract burns the tokens permanently, eliminating double-counting.
4. **Demonstrate Clean Receipt Printing** (`/portfolio/retirements/CERT-2026-001`):
   - Click **"Print / Save PDF Receipt"**.
   - **Show the Jury**: All web navigation, buttons, and backgrounds disappear!
   - Only the official bordered **A4 Certificate** with dynamic QR code, on-chain burn transaction hash, and ISO-14065 audit stamp is rendered.

---

## 3. Key Concepts & Terminology Glossary

| Term | Definition |
|---|---|
| **Blue Carbon** | Carbon captured and stored by coastal and marine ecosystems (mangroves, tidal marshes, seagrasses). Stores up to 10x more carbon per hectare than tropical rainforests. |
| **MRV** | **Measurement, Reporting, and Verification** — the multi-step protocol ensuring carbon removal is scientifically measured, transparently reported, and independently verified. |
| **AGB (Above-Ground Biomass)** | Mass of living organic matter above the soil, including tree trunk, bark, branches, and foliage. |
| **BGB (Below-Ground Biomass)** | Mass of living roots, particularly mangrove stilt and pneumatophore root systems that trap sediment. |
| **SOC (Soil Organic Carbon)** | Organic carbon stored in anoxic, waterlogged sediments up to 1–3 meters deep, capable of persisting for thousands of years. |
| **NDVI** | **Normalized Difference Vegetation Index** ($(\text{NIR} - \text{Red})/(\text{NIR} + \text{Red})$) computed from Sentinel-2 satellite bands to assess canopy vigor and photosynthetic density. |
| **DBH** | **Diameter at Breast Height** ($1.3\,\text{m}$ above ground) used in Komiyama allometric equations. |
| **Additionality** | Proof that the carbon sequestration would *not* have occurred without the restorative carbon project intervention ($\Delta C = C_{\text{project}} - C_{\text{baseline}}$). |
| **Permanence Buffer** | A mandatory deduction ($15\%$) held in a collective protocol pool to insure against physical risks (cyclones, sea-level rise, die-offs). |
| **Token Burn / Retirement** | Irreversible on-chain burning of BCT tokens so they can never be resold or double-counted. |

---

## 4. Scientific MRV Mathematical Formulas (IPCC VM0033)

Be ready to explain these equations if technical judges ask:

### 1. Above-Ground Tree Biomass (Komiyama Model for Mangroves)
$$\text{Single Tree AGB (kg)} = 0.251 \times \rho \times (\text{DBH})^{2.46}$$
- $\rho$: Wood specific gravity (e.g., $0.74\,\text{g/cm}^3$ for *Rhizophora mucronata*).
- $\text{DBH}$: Diameter at breast height in $\text{cm}$.
$$\text{AGB Carbon (tC/ha)} = \left(\frac{\text{Single Tree AGB} \times \text{Tree Density}}{1000}\right) \times 0.47$$

### 2. Below-Ground Root Biomass (BGB)
$$\text{BGB (t/ha)} = \text{AGB} \times 0.49$$
$$\text{BGB Carbon (tC/ha)} = \text{BGB} \times 0.39$$

### 3. Soil Organic Carbon (SOC)
$$\text{SOC (tC/ha)} = \text{Core Depth (cm)} \times \text{Dry Bulk Density (g/cm}^3) \times \left(\frac{\text{SOC}\%}{100}\right) \times 100$$
- Example: $100\,\text{cm} \times 1.18\,\text{g/cm}^3 \times 0.036 \times 100 = 424.8\,\text{tC/ha}$.

### 4. Total Carbon Stock & Additionality Delta
$$C_{\text{total}} = \text{AGB Carbon} + \text{BGB Carbon} + \text{SOC Carbon}$$
$$\Delta C = \max(0, C_{\text{total}} - C_{\text{baseline}})$$

### 5. Conversion to Gross Metric Tonnes of $CO_2$ Equivalent ($tCO_2e$)
$$\text{Gross } tCO_2e = \Delta C \times \left(\frac{44}{12}\right) \times \text{Restored Area (ha)}$$
*(Note: $\frac{44}{12} \approx 3.667$ is the molecular ratio of $CO_2$ to elemental Carbon).*

### 6. Permanence Buffer & Net Issuable BCT Tokens
$$\text{Buffer Reserve (15\%)} = \text{Gross } tCO_2e \times 0.15$$
$$\text{Net Issuable Credits (BCT)} = \text{Gross } tCO_2e \times 0.85$$

---

## 5. Role-Based Access Control (RBAC) System

BlueTrace isolates every stakeholder into their dedicated workspace:

```
┌─────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Role                    │ Dedicated Capabilities & URLs                               │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🌍 Public Explorer      │ View verified plots, GIS satellite maps, live carbon beacon │
│                         │ URL: /registry, /registry/[id], /transparency               │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🌿 1. Project Developer │ Register plots, Location Scaling Slider, GPS auto-detect,    │
│                         │ upload drone/NDVI telemetry, run MRV calculator             │
│                         │ URL: /developer, /developer/projects/new, /developer/[id]   │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🧭 2. Field Officer     │ Ground-truthing workbench, GPS boundary verification,       │
│                         │ record canopy score & soil core lab refs, stamp approval    │
│                         │ URL: /field-officer                                         │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ ⚖️ 3. Verifier / Auditor│ ISO-14065 audit workbench, math proof verification,         │
│                         │ execute on-chain smart contract minting with serial ranges  │
│                         │ URL: /verifier                                              │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 💼 4. Credit Buyer      │ Manage credit portfolio, transfer tokens, permanently burn  │
│                         │ credits for ESG compliance, print official A4 receipts      │
│                         │ URL: /portfolio, /portfolio/retirements/[id]                │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 🛡️ 5. Registry Admin    │ Master protocol telemetry, ecosystem stats, emergency pause │
│                         │ URL: /admin                                                 │
└─────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 6. Blockchain & Smart Contract Architecture

1. **Polygon Proof-of-Stake Mainnet / Local Testnet**:
   - Ultra-low carbon footprint ($<0.001\,\text{kWh}$ per transaction).
   - Fast block finality ($~2\,\text{seconds}$) and sub-cent gas fees.
2. **Smart Contract Interfaces**:
   - `BlueTraceRegistry.sol` (`0x9B41...E89a`): Anchors project metadata, GPS polygon hash, and Stage 1-2-3 approval signatures.
   - `BlueCarbonToken.sol (ERC-20/ERC-1155)` (`0x27C1...78B4`): Manages tokenized BCT carbon credits with unique batch serial IDs.
   - `RetirementLedger.sol` (`0x6e28...9812`): Implements `burn()` mechanism emitting `CreditRetired` events with irreversible SHA-256 certificate hashes.
3. **Dual-Layer Persistence**:
   - **Local Storage Cache**: Instant client-side UI hydration and offline-first state synchronization.
   - **Server JSON Database (`data/bluetrace_db.json`)**: Persistent storage via Next.js REST API routes (`/api/projects`, `/api/retirements`, `/api/holdings`).

---

## 7. Hackathon Jury FAQ & Defense Strategy

### Q1: *"How does BlueTrace prevent fake or fraudulent project registrations?"*
> **Answer**: BlueTrace uses a **tripartite verification architecture**:
> 1. In Stage 1, the developer registers satellite coordinates and uploads drone LiDAR/soil baseline data.
> 2. In Stage 2, an accredited independent **Field Officer** performs physical handheld RTK DGPS ground-truthing and enters accredited laboratory soil sample IDs.
> 3. In Stage 3, an **ISO-14065 Auditor** cryptographically audits the proof hash before signing the smart contract minting transaction. No single entity can unilaterally mint credits.

### Q2: *"How do you handle the risk of mangroves dying or being destroyed by a cyclone?"*
> **Answer**: BlueTrace implements a **15% Permanence Buffer Reserve**. For every 100 tonnes of verified sequestration, only 85 BCT tokens are issued, while 15 tonnes are deposited into the protocol insurance reserve. In the event of catastrophic physical loss, the protocol locks the buffer to guarantee buyer credit integrity.

### Q3: *"How do you avoid double-counting across different registries (e.g., Verra or Gold Standard)?"*
> **Answer**: Every issued batch has a **globally unique cryptographic serial range** (e.g. `BCR-IND-001-2026-B1-0001-8420`) tied to the geographic polygon boundary. When a corporate buyer retires credits, the smart contract permanently burns the tokens on-chain and generates an immutable certificate with dynamic QR verification.

### Q4: *"Why Blue Carbon instead of standard terrestrial forestry (Afforestation)?"*
> **Answer**: Coastal blue carbon ecosystems sequester carbon at rates **up to 10 times higher per hectare** than terrestrial tropical rainforests. Furthermore, while terrestrial forests release carbon when trees die or burn, mangroves store carbon in submerged, anaerobic sediments where it remains locked for centuries to millennia without decomposing.

### Q5: *"Is the map satellite imagery live?"*
> **Answer**: Yes! BlueTrace streams **Google Satellite & Hybrid GIS tiles at 0.3m/px resolution**, combined with Sentinel-2 multispectral vegetation index (NDVI) overlays and interactive GPS polygon scaling.

---

## 8. Quick Command Cheatsheet for Live Demo

```bash
# 1. Start Production Server
npm start
# (Runs on http://localhost:3000)

# 2. If running development mode
npm run dev

# 3. If running with Docker Compose
docker compose up -d

# 4. Verify TypeScript check
npx tsc --noEmit

# 5. Build for production
npm run build
```

---

### 🏆 Key Demo URLs
- **Homepage & Science Explainer**: [http://localhost:3000](http://localhost:3000)
- **Public GIS Map & Carbon Beacons**: [http://localhost:3000/registry](http://localhost:3000/registry)
- **Developer Registration & Scaling Slider**: [http://localhost:3000/developer/projects/new](http://localhost:3000/developer/projects/new)
- **Field Officer Ground-Truthing**: [http://localhost:3000/field-officer](http://localhost:3000/field-officer)
- **Verifier Smart Contract Sign-off**: [http://localhost:3000/verifier](http://localhost:3000/verifier)
- **Buyer Portfolio & A4 Print Receipt**: [http://localhost:3000/portfolio/retirements/CERT-2026-001](http://localhost:3000/portfolio/retirements/CERT-2026-001)
- **On-Chain Transparency Ledger**: [http://localhost:3000/transparency](http://localhost:3000/transparency)

---

*Prepared for BlueTrace Hackathon Final Review & Live Demo.*
