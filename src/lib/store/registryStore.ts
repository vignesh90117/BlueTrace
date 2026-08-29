import { 
  Project, 
  MangroveTelemetryInput, 
  MRVCalculationResult, 
  CreditHolding, 
  RetirementCertificate, 
  BlockchainTransaction,
  FieldInspectionReport,
  GeoCoordinate
} from '@/types';
import { calculateMangroveMRV } from '@/lib/mrv/mangrove';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'BCR-IND-001',
    slug: 'sundarbans-biosphere-mangrove-initiative',
    name: 'Sundarbans Estuarine Mangrove Biosphere Project',
    ecosystemType: 'Mangrove',
    country: 'India',
    region: 'West Bengal',
    areaHectares: 185.0,
    developerName: 'Dr. Debabrata Mukherjee',
    developerWallet: '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
    organization: 'Sundarbans Coastal Bio-Shield Initiative',
    status: 'credits_issued',
    registeredDate: '2025-02-10',
    plantingStartDate: '2025-03-01',
    methodology: 'VM0033 (Tidal Wetland Restoration)',
    dominantSpecies: ['Rhizophora mucronata', 'Avicennia marina', 'Ceriops decandra'],
    coordinates: [
      { lat: 21.8420, lng: 88.8250 },
      { lat: 21.8580, lng: 88.8450 },
      { lat: 21.8390, lng: 88.8650 },
      { lat: 21.8210, lng: 88.8350 },
    ],
    centerCoordinate: { lat: 21.8400, lng: 88.8425 },
    description: 'Large-scale restoration of severely eroded tidal mangrove sediment in the Sundarbans Delta. Restores wave attenuation, coastal fishery breeding nurseries, and deep anoxic sediment carbon burial.',
    baselineSummary: 'Degraded saline intertidal mudflat. Pre-project baseline soil carbon stock measured at 38.5 tC/ha.',
    evidenceFiles: [
      {
        id: 'ev-01',
        title: 'LiDAR Drone Point Cloud (120 pts/m²)',
        fileType: 'point_cloud_lidar',
        ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        fileSizeMb: 142.5,
        uploadedAt: '2026-01-14',
        verified: true,
      },
      {
        id: 'ev-02',
        title: 'Soil Core Chromatography (0-100cm Depth TOC)',
        fileType: 'soil_core_chromatography',
        ipfsHash: 'QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx',
        fileSizeMb: 18.2,
        uploadedAt: '2026-01-16',
        verified: true,
      },
      {
        id: 'ev-03',
        title: 'Sentinel-2 L2A Multispectral Orthomosaic (NDVI 0.78)',
        fileType: 'satellite_multispectral',
        ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        fileSizeMb: 85.0,
        uploadedAt: '2026-01-20',
        verified: true,
      }
    ],
    telemetryData: {
      averageDbhCm: 15.2,
      treeDensityPerHa: 1350,
      woodDensityGcm3: 0.74,
      canopyHeightMeters: 8.2,
      soilBulkDensityGcm3: 1.18,
      soilOrganicCarbonPercent: 3.65,
      soilDepthSampledCm: 100,
      ndwiWaterIndex: 0.42,
      ndviMeanIndex: 0.78,
      baselineCarbonStockPerHa: 38.5,
      monitoringYear: 2026,
    },
    mrvResult: {
      agbDryMatterKgPerTree: 153.3,
      totalAgbDryMatterTonnesPerHa: 206.96,
      agbBiomassTonnesPerHa: 206.96,
      agbCarbonTonnesPerHa: 97.27,
      carbonStockAgbTCPerHa: 97.27,
      carbonStockBgbTCPerHa: 39.55,
      bgbBiomassTonnesPerHa: 101.41,
      bgbCarbonTonnesPerHa: 39.55,
      carbonStockSocTCPerHa: 43.07,
      socCarbonTonnesPerHa: 43.07,
      totalCarbonStockTCPerHa: 179.89,
      totalCurrentCarbonStockPerHa: 179.89,
      netCarbonStockDeltaTCPerHa: 141.39,
      grossSequesteredTCO2e: 95886.1,
      totalGrossSequestrationTCO2e: 95886.1,
      permanenceBufferPoolTCO2e: 14382.9,
      bufferPoolDeductionTCO2e: 14382.9,
      netIssuableCreditsTCO2e: 81503.2,
      reportSha256Hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      calculatedAt: '2026-01-22T10:30:00Z',
    },
    fieldInspection: {
      officerName: 'Rajesh Sen, Field Inspector',
      officerWallet: '0x5592EC0cfb4dbc12D3aD100b257153436a1f0FEa',
      officerDesignation: 'State Forest & Coastal Ecosystem Officer',
      inspectedAt: '2026-01-18',
      gpsGroundTruthVerified: true,
      canopyVigorScore: 94.5,
      soilCoreSampleRef: 'CORE-SBN-2026-04',
      droneFlightRef: 'FLIGHT-LIDAR-SBN-88',
      fieldNotes: 'On-site ground survey completed. Verified 185ha boundary with RTK GPS (±2cm accuracy). Rhizophora canopy density and soil core stratigraphy consistent with submitted sensor logs.',
      inspectionStatus: 'approved',
      fieldReportHash: '0x4f88219c0b1156e7280aa3856230bf982847a918a38b29f76a59bc837d99a1b2'
    },
    totalCreditsIssued: 8420.5,
    totalCreditsRetired: 2150.0,
    blockchainTx: {
      registryTxHash: '0x8f2d659a45e99831d102eef5781a9425c2763f0d2c94ea3810f54519962a9812',
      fieldSignTxHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      verifierTxHash: '0x4f8a129d3c5e7b9a0f124689cbed4710a39fbc8592039a8571829e93bcdefa01',
      verifierAddress: '0x435422896A62024CE95B7286375F119a0A678d10',
      verifierName: 'Global Blue Marine Audits Ltd (ISO 14065)',
      issuedTokenBatchId: 'BCT-2026-V1-001',
      serialRange: 'BCR-IND-001-2026-B1-0001-8420',
    }
  },
  {
    id: 'BCR-IND-002',
    slug: 'pichavaram-wetland-carbon-restoration',
    name: 'Pichavaram Mangrove Tidal Lagoon Ecosystem',
    ecosystemType: 'Mangrove',
    country: 'India',
    region: 'Tamil Nadu',
    areaHectares: 120.0,
    developerName: 'Dr. K. Swaminathan',
    developerWallet: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    organization: 'Tamil Nadu Coastal Conservation Council',
    status: 'field_approved',
    registeredDate: '2025-06-15',
    plantingStartDate: '2025-07-01',
    methodology: 'VM0033 (Tidal Wetland Restoration)',
    dominantSpecies: ['Avicennia marina', 'Rhizophora apiculata'],
    coordinates: [
      { lat: 11.4280, lng: 79.7820 },
      { lat: 11.4420, lng: 79.7990 },
      { lat: 11.4310, lng: 79.8120 },
      { lat: 11.4150, lng: 79.7950 },
    ],
    centerCoordinate: { lat: 11.4300, lng: 79.7960 },
    description: 'Estuarine lagoon channel stabilization through restorative planting of viviparous mangrove propagules to rebuild benthic blue carbon sinks.',
    baselineSummary: 'Hyper-saline degraded tidal flat with baseline SOC of 28.2 tC/ha.',
    evidenceFiles: [
      {
        id: 'ev-11',
        title: 'Pichavaram Orthomosaic Imagery',
        fileType: 'drone_orthomosaic',
        ipfsHash: 'QmQPeNsJPyVWPFDVHb77w8G42Fvo15z4bG2X8D2GhFc56V',
        fileSizeMb: 64.0,
        uploadedAt: '2026-01-28',
        verified: true,
      }
    ],
    telemetryData: {
      averageDbhCm: 12.8,
      treeDensityPerHa: 1600,
      woodDensityGcm3: 0.72,
      canopyHeightMeters: 6.9,
      soilBulkDensityGcm3: 1.22,
      soilOrganicCarbonPercent: 3.10,
      soilDepthSampledCm: 100,
      ndwiWaterIndex: 0.48,
      ndviMeanIndex: 0.72,
      baselineCarbonStockPerHa: 28.2,
      monitoringYear: 2026,
    },
    mrvResult: {
      agbDryMatterKgPerTree: 98.4,
      totalAgbDryMatterTonnesPerHa: 157.44,
      agbBiomassTonnesPerHa: 157.44,
      agbCarbonTonnesPerHa: 73.99,
      carbonStockAgbTCPerHa: 73.99,
      carbonStockBgbTCPerHa: 30.08,
      bgbBiomassTonnesPerHa: 77.15,
      bgbCarbonTonnesPerHa: 30.08,
      carbonStockSocTCPerHa: 37.82,
      socCarbonTonnesPerHa: 37.82,
      totalCarbonStockTCPerHa: 141.89,
      totalCurrentCarbonStockPerHa: 141.89,
      netCarbonStockDeltaTCPerHa: 113.69,
      grossSequesteredTCO2e: 49998.0,
      totalGrossSequestrationTCO2e: 49998.0,
      permanenceBufferPoolTCO2e: 7499.7,
      bufferPoolDeductionTCO2e: 7499.7,
      netIssuableCreditsTCO2e: 42498.3,
      reportSha256Hash: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
      calculatedAt: '2026-02-01T14:00:00Z',
    },
    fieldInspection: {
      officerName: 'S. Selvakumar',
      officerWallet: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      officerDesignation: 'District Forest Officer (Cuddalore)',
      inspectedAt: '2026-02-03',
      gpsGroundTruthVerified: true,
      canopyVigorScore: 89.0,
      soilCoreSampleRef: 'CORE-PCH-2026-01',
      droneFlightRef: 'DRONE-PCH-SURVEY-12',
      fieldNotes: 'Field ground truth inspection completed. 120 ha boundary confirmed with handheld DGPS. Soil core sample salinity and root penetration validated. Approved for final Verifier audit.',
      inspectionStatus: 'approved',
      fieldReportHash: '0x12a84b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a'
    },
    totalCreditsIssued: 0,
    totalCreditsRetired: 0,
    blockchainTx: {
      registryTxHash: '0x12b598471c0827364b9182374e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      fieldSignTxHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f'
    }
  },
  {
    id: 'BCR-IND-003',
    slug: 'gulf-of-kutch-marine-park-mangrove',
    name: 'Gulf of Kutch Marine Park Coastal Blue Carbon Belt',
    ecosystemType: 'Mangrove',
    country: 'India',
    region: 'Gujarat',
    areaHectares: 240.0,
    developerName: 'Priya Jadeja',
    developerWallet: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    organization: 'Gujarat Ecology Commission',
    status: 'field_approved',
    registeredDate: '2025-09-20',
    plantingStartDate: '2025-10-05',
    methodology: 'VM0033 (Tidal Wetland Restoration)',
    dominantSpecies: ['Avicennia marina'],
    coordinates: [
      { lat: 22.4500, lng: 69.8200 },
      { lat: 22.4700, lng: 69.8450 },
      { lat: 22.4550, lng: 69.8650 },
      { lat: 22.4350, lng: 69.8350 },
    ],
    centerCoordinate: { lat: 22.4520, lng: 69.8410 },
    description: 'Arid zone mangrove afforestation in the intertidal mudflats of the Gulf of Kutch to establish high-durability sediment carbon reservoirs in hyper-saline conditions.',
    baselineSummary: 'Barren saline coastal mudflat with sparse scrub vegetation (<15 tC/ha).',
    evidenceFiles: [],
    telemetryData: {
      averageDbhCm: 11.5,
      treeDensityPerHa: 1200,
      woodDensityGcm3: 0.70,
      canopyHeightMeters: 5.5,
      soilBulkDensityGcm3: 1.25,
      soilOrganicCarbonPercent: 2.80,
      soilDepthSampledCm: 100,
      ndwiWaterIndex: 0.38,
      ndviMeanIndex: 0.68,
      baselineCarbonStockPerHa: 15.0,
      monitoringYear: 2026,
    },
    mrvResult: {
      agbDryMatterKgPerTree: 74.2,
      totalAgbDryMatterTonnesPerHa: 89.04,
      agbBiomassTonnesPerHa: 89.04,
      agbCarbonTonnesPerHa: 41.85,
      carbonStockAgbTCPerHa: 41.85,
      carbonStockBgbTCPerHa: 17.02,
      bgbBiomassTonnesPerHa: 43.63,
      bgbCarbonTonnesPerHa: 17.02,
      carbonStockSocTCPerHa: 35.00,
      socCarbonTonnesPerHa: 35.00,
      totalCarbonStockTCPerHa: 93.87,
      totalCurrentCarbonStockPerHa: 93.87,
      netCarbonStockDeltaTCPerHa: 78.87,
      grossSequesteredTCO2e: 69395.6,
      totalGrossSequestrationTCO2e: 69395.6,
      permanenceBufferPoolTCO2e: 10409.3,
      bufferPoolDeductionTCO2e: 10409.3,
      netIssuableCreditsTCO2e: 58986.3,
      reportSha256Hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      calculatedAt: '2026-02-10T09:00:00Z',
    },
    fieldInspection: {
      officerName: 'Rajesh Sen',
      officerWallet: '0x5592EC0cfb4dbc12D3aD100b257153436a1f0FEa',
      officerDesignation: 'State Forest & Coastal Ecosystem Officer',
      inspectedAt: '2026-02-12',
      gpsGroundTruthVerified: true,
      canopyVigorScore: 88.5,
      soilCoreSampleRef: 'CORE-KTC-2026-02',
      droneFlightRef: 'DRONE-KTC-FLIGHT-09',
      fieldNotes: 'On-site DGPS ground survey completed. Verified 240 ha boundary. Avicennia marina survival rate 92%. Ready for Stage 3 Auditor sign-off.',
      inspectionStatus: 'approved',
      fieldReportHash: '0x33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122'
    },
    totalCreditsIssued: 0,
    totalCreditsRetired: 0,
    blockchainTx: {
      registryTxHash: '0x33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122',
      fieldSignTxHash: '0x5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344'
    }
  }
];

const INITIAL_HOLDINGS: CreditHolding[] = [
  {
    id: 'HOLD-001',
    projectId: 'BCR-IND-001',
    projectName: 'Sundarbans Estuarine Mangrove Biosphere Project',
    batchId: 'BCT-2026-V1-001',
    vintage: 2026,
    serialRange: 'BCR-IND-001-2026-B1-0001-8420',
    availableCredits: 6270.5,
    totalMintedCredits: 8420.5,
    retiredCredits: 2150.0,
    holderWallet: '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
    ecosystemType: 'Mangrove',
    issuanceTxHash: '0x4f8a129d3c5e7b9a0f124689cbed4710a39fbc8592039a8571829e93bcdefa01',
  }
];

const INITIAL_CERTIFICATES: RetirementCertificate[] = [
  {
    certificateId: 'CERT-2026-001',
    holdingId: 'HOLD-001',
    projectId: 'BCR-IND-001',
    projectName: 'Sundarbans Estuarine Mangrove Biosphere Project',
    batchId: 'BCT-2026-V1-001',
    vintage: 2026,
    serialRange: 'BCR-IND-001-2026-B1-0001-2150',
    amountTCO2e: 2150.0,
    retireeName: 'EcoTech Global Corp',
    beneficiary: 'EcoTech Global Infrastructure Ltd',
    reason: 'Scope 1 & 2 Corporate Carbon Neutrality Milestone Q1 2026',
    retiredAt: '2026-02-05T16:45:00Z',
    retiredTimestamp: '2026-02-05T16:45:00Z',
    burnerWallet: '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
    burnTxHash: '0x9922aa88bb77cc66dd55ee44ff3300112233445566778899aabbccddeeff0011',
    onChainTxHash: '0x9922aa88bb77cc66dd55ee44ff3300112233445566778899aabbccddeeff0011',
    immutableCertificateHash: 'sha256-4c7b8e1f0a9d8c7b6a5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a',
  }
];

const INITIAL_TXS: BlockchainTransaction[] = [
  {
    id: 'tx-01',
    txHash: '0x8f2d659a45e99831d102eef5781a9425c2763f0d2c94ea3810f54519962a9812',
    blockNumber: 4893010,
    timestamp: '2025-02-10T09:12:00Z',
    from: '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
    to: '0xRegistryContract119a0A678d10',
    type: 'PROJECT_REGISTRATION',
    details: 'Project BCR-IND-001 (Sundarbans 185ha) registered on-chain with spatial polygon boundary.'
  },
  {
    id: 'tx-02',
    txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockNumber: 4893045,
    timestamp: '2026-01-18T11:20:00Z',
    from: '0x5592EC0cfb4dbc12D3aD100b257153436a1f0FEa',
    to: '0xRegistryContract119a0A678d10',
    type: 'FIELD_INSPECTION_SIGN',
    details: 'Field Officer Rajesh Sen ground-truth verified GPS boundary and soil core samples for BCR-IND-001.'
  },
  {
    id: 'tx-03',
    txHash: '0x4f8a129d3c5e7b9a0f124689cbed4710a39fbc8592039a8571829e93bcdefa01',
    blockNumber: 4893088,
    timestamp: '2026-01-22T14:30:00Z',
    from: '0x435422896A62024CE95B7286375F119a0A678d10',
    to: '0xCreditContract220a0B778c21',
    type: 'CREDITS_MINTED',
    details: 'Verifier signed off MRV report hash. Minted 8,420.5 BCT tokens (Batch BCT-2026-V1-001) to Project Developer.'
  },
  {
    id: 'tx-04',
    txHash: '0x9922aa88bb77cc66dd55ee44ff3300112233445566778899aabbccddeeff0011',
    blockNumber: 4893115,
    timestamp: '2026-02-05T16:45:00Z',
    from: '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
    to: '0x000000000000000000000000000000000000dEaD',
    type: 'CREDITS_RETIRED',
    details: 'Permanently burned 2,150.0 BCT credits. Certificate CERT-2026-001 issued for EcoTech Global Corp.'
  }
];

class RegistryStore {
  private projects: Project[] = INITIAL_PROJECTS;
  private holdings: CreditHolding[] = INITIAL_HOLDINGS;
  private certificates: RetirementCertificate[] = INITIAL_CERTIFICATES;
  private transactions: BlockchainTransaction[] = INITIAL_TXS;

  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id || p.slug === id);
  }

  getHoldings(): CreditHolding[] {
    return [...this.holdings];
  }

  getCertificates(): RetirementCertificate[] {
    return [...this.certificates];
  }

  getCertificateById(id: string): RetirementCertificate | undefined {
    return this.certificates.find(c => c.certificateId === id);
  }

  getTransactions(): BlockchainTransaction[] {
    return [...this.transactions];
  }

  registerProject(projectData: Omit<Project, 'id' | 'status' | 'registeredDate' | 'evidenceFiles' | 'totalCreditsIssued' | 'totalCreditsRetired'>): Project {
    const nextIdx = this.projects.length + 1;
    const id = `BCR-IND-00${nextIdx}`;
    const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    const newProject: Project = {
      ...projectData,
      id,
      status: 'submitted',
      registeredDate: new Date().toISOString().split('T')[0],
      evidenceFiles: [],
      totalCreditsIssued: 0,
      totalCreditsRetired: 0,
      blockchainTx: {
        registryTxHash: txHash
      }
    };

    this.projects.unshift(newProject);

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: 4893120 + this.projects.length,
      timestamp: new Date().toISOString(),
      from: projectData.developerWallet,
      to: '0xRegistryContract119a0A678d10',
      type: 'PROJECT_REGISTRATION',
      details: `Project ${id} (${projectData.name}, ${projectData.areaHectares}ha) registered on-chain by Owner.`
    });

    return newProject;
  }

  // PROJECT OWNER ACCESS: Edit Location & GIS Coordinates
  updateProjectLocation(
    projectId: string, 
    centerLat: number, 
    centerLng: number, 
    areaHectares: number, 
    region: string, 
    country: string,
    coordinates?: GeoCoordinate[]
  ): Project {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    const newCoords = coordinates || [
      { lat: centerLat + 0.015, lng: centerLng - 0.015 },
      { lat: centerLat + 0.018, lng: centerLng + 0.012 },
      { lat: centerLat - 0.012, lng: centerLng + 0.016 },
      { lat: centerLat - 0.015, lng: centerLng - 0.010 },
    ];

    project.centerCoordinate = { lat: centerLat, lng: centerLng };
    project.coordinates = newCoords;
    project.areaHectares = areaHectares;
    project.region = region;
    project.country = country;

    // If was rejected, resetting status to 'submitted' / 'field_review' for re-inspection
    if (project.status === 'rejected') {
      project.status = 'submitted';
    }

    if (project.telemetryData) {
      project.mrvResult = calculateMangroveMRV(project.telemetryData, areaHectares);
    }

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: 4893120 + this.transactions.length,
      timestamp: new Date().toISOString(),
      from: project.developerWallet,
      to: '0xRegistryContract119a0A678d10',
      type: 'PROJECT_REGISTRATION',
      details: `Project Owner updated GIS location & polygon boundary for ${project.id} (${areaHectares}ha at ${centerLat}°N, ${centerLng}°E).`
    });

    return project;
  }

  uploadTelemetryAndCalculate(projectId: string, telemetry: MangroveTelemetryInput): MRVCalculationResult {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const result = calculateMangroveMRV(telemetry, project.areaHectares);
    project.telemetryData = telemetry;
    project.mrvResult = result;
    project.status = 'field_review'; // Moves to Stage 2: Field Officer Ground-Truth

    return result;
  }

  // STAGE 2: Field Officer Review & Ground-Truthing (Approve OR Reject)
  submitFieldInspection(
    projectId: string, 
    officerName: string, 
    officerWallet: string, 
    designation: string,
    canopyVigorScore: number,
    soilCoreSampleRef: string,
    droneFlightRef: string,
    fieldNotes: string,
    status: 'approved' | 'rejected'
  ): FieldInspectionReport {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const fieldHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    const inspectionReport: FieldInspectionReport = {
      officerName,
      officerWallet,
      officerDesignation: designation,
      inspectedAt: new Date().toISOString().split('T')[0],
      gpsGroundTruthVerified: status === 'approved',
      canopyVigorScore,
      soilCoreSampleRef,
      droneFlightRef,
      fieldNotes,
      inspectionStatus: status,
      fieldReportHash: fieldHash
    };

    project.fieldInspection = inspectionReport;
    project.status = status === 'approved' ? 'field_approved' : 'rejected';
    
    if (!project.blockchainTx) {
      project.blockchainTx = { registryTxHash: txHash };
    }
    project.blockchainTx.fieldSignTxHash = txHash;

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: 4893120 + this.transactions.length,
      timestamp: new Date().toISOString(),
      from: officerWallet,
      to: '0xRegistryContract119a0A678d10',
      type: 'FIELD_INSPECTION_SIGN',
      details: `Field Officer ${officerName} stamped ${status.toUpperCase()} on project ${project.id}. Notes: ${fieldNotes.slice(0, 60)}...`
    });

    return inspectionReport;
  }

  // STAGE 3: Independent Verifier Reject Action
  rejectVerifierAudit(projectId: string, verifierName: string, verifierWallet: string, rejectionReason: string): Project {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    project.status = 'rejected';
    if (project.fieldInspection) {
      project.fieldInspection.fieldNotes += ` | Verifier Audit Rejected: ${rejectionReason}`;
    }

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: 4893120 + this.transactions.length,
      timestamp: new Date().toISOString(),
      from: verifierWallet,
      to: '0xRegistryContract119a0A678d10',
      type: 'MRV_VERIFIED',
      details: `Verifier ${verifierName} REJECTED project ${project.id}. Reason: ${rejectionReason}`
    });

    return project;
  }

  // STAGE 3: Final Verification & Credit Minting by Administrator / Independent Verifier
  verifyAndIssueCredits(projectId: string, verifierName: string, verifierWallet: string, notes: string): { txHash: string; creditsMinted: number } {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');
    
    // Auto-calculate MRV if missing
    if (!project.mrvResult) {
      if (project.telemetryData) {
        project.mrvResult = calculateMangroveMRV(project.telemetryData, project.areaHectares);
      } else {
        const defaultTelemetry: MangroveTelemetryInput = {
          averageDbhCm: 14.5,
          treeDensityPerHa: 1400,
          woodDensityGcm3: 0.73,
          canopyHeightMeters: 7.8,
          soilBulkDensityGcm3: 1.20,
          soilOrganicCarbonPercent: 3.40,
          soilDepthSampledCm: 100,
          ndwiWaterIndex: 0.45,
          ndviMeanIndex: 0.75,
          baselineCarbonStockPerHa: 30.0,
          monitoringYear: 2026,
        };
        project.telemetryData = defaultTelemetry;
        project.mrvResult = calculateMangroveMRV(defaultTelemetry, project.areaHectares);
      }
    }

    const creditsToMint = Math.round(project.mrvResult.netIssuableCreditsTCO2e * 10) / 10;
    const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const batchId = `BCT-2026-V1-00${this.holdings.length + 1}`;
    const serialRange = `${project.id}-2026-B1-0001-${Math.round(creditsToMint)}`;

    project.status = 'credits_issued';
    project.totalCreditsIssued = creditsToMint;

    if (!project.blockchainTx) {
      project.blockchainTx = { registryTxHash: txHash };
    }
    project.blockchainTx.verifierTxHash = txHash;
    project.blockchainTx.verifierAddress = verifierWallet;
    project.blockchainTx.verifierName = verifierName;
    project.blockchainTx.issuedTokenBatchId = batchId;
    project.blockchainTx.serialRange = serialRange;

    // Create holding in Project Developer's wallet
    const newHolding: CreditHolding = {
      id: `HOLD-00${this.holdings.length + 1}`,
      projectId: project.id,
      projectName: project.name,
      batchId,
      vintage: 2026,
      serialRange,
      availableCredits: creditsToMint,
      totalMintedCredits: creditsToMint,
      retiredCredits: 0,
      holderWallet: project.developerWallet,
      ecosystemType: project.ecosystemType,
      issuanceTxHash: txHash,
    };

    this.holdings.unshift(newHolding);

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: 4893130 + this.transactions.length,
      timestamp: new Date().toISOString(),
      from: verifierWallet,
      to: project.developerWallet,
      type: 'CREDITS_MINTED',
      details: `Independent Verifier (${verifierName}) approved & minted ${creditsToMint.toLocaleString()} BCT tokens (Batch ${batchId}) with serial range ${serialRange}.`
    });

    return { txHash, creditsMinted: creditsToMint };
  }

  retireCredits(holdingId: string, amount: number, retireeName: string, beneficiary: string, reason: string): RetirementCertificate {
    const holding = this.holdings.find(h => h.id === holdingId);
    if (!holding) throw new Error('Credit holding not found');
    if (amount <= 0 || amount > holding.availableCredits) throw new Error('Invalid retirement amount');

    const certId = `CERT-2026-00${this.certificates.length + 1}`;
    const burnTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const certHash = 'sha256-' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    holding.availableCredits -= amount;
    holding.retiredCredits += amount;

    const project = this.getProjectById(holding.projectId);
    if (project) {
      project.totalCreditsRetired += amount;
    }

    const newCertificate: RetirementCertificate = {
      certificateId: certId,
      holdingId,
      projectId: holding.projectId,
      projectName: holding.projectName,
      batchId: holding.batchId,
      vintage: 2026,
      serialRange: `${holding.serialRange.split('-').slice(0, 4).join('-')}-R0001-${amount}`,
      amountTCO2e: amount,
      retireeName,
      beneficiary,
      reason,
      retiredAt: new Date().toISOString(),
      retiredTimestamp: new Date().toISOString(),
      burnerWallet: holding.holderWallet,
      burnTxHash,
      onChainTxHash: burnTxHash,
      immutableCertificateHash: certHash,
    };

    this.certificates.unshift(newCertificate);

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash: burnTxHash,
      blockNumber: 4893140 + this.transactions.length,
      timestamp: new Date().toISOString(),
      from: holding.holderWallet,
      to: '0x000000000000000000000000000000000000dEaD',
      type: 'CREDITS_RETIRED',
      details: `Permanently burned ${amount.toLocaleString()} BCT credits. Issued tamper-proof offset Certificate ${certId} to ${beneficiary}.`
    });

    return newCertificate;
  }
}

export const store = new RegistryStore();
