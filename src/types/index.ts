export type UserRole = 'public' | 'developer' | 'field_officer' | 'verifier' | 'buyer' | 'admin';

export type EcosystemType = 'Mangrove' | 'Seagrass' | 'Salt Marsh' | 'Coastal Wetland';

export type ProjectStatus = 
  | 'draft'
  | 'submitted'
  | 'field_review'
  | 'field_approved'
  | 'under_review'
  | 'mrv_ready'
  | 'credits_issued'
  | 'rejected';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface MangroveTelemetryInput {
  averageDbhCm: number;
  treeDensityPerHa: number;
  woodDensityGcm3: number;
  canopyHeightMeters: number;
  soilBulkDensityGcm3: number;
  soilOrganicCarbonPercent: number;
  soilDepthSampledCm: number;
  ndwiWaterIndex: number;
  ndviMeanIndex: number;
  baselineCarbonStockPerHa: number;
  monitoringYear: number;
}

export interface MRVCalculationResult {
  agbDryMatterKgPerTree: number;
  totalAgbDryMatterTonnesPerHa: number;
  agbBiomassTonnesPerHa?: number;
  agbCarbonTonnesPerHa?: number;
  carbonStockAgbTCPerHa: number;
  carbonStockBgbTCPerHa: number;
  bgbBiomassTonnesPerHa?: number;
  bgbCarbonTonnesPerHa?: number;
  carbonStockSocTCPerHa: number;
  socCarbonTonnesPerHa?: number;
  totalCarbonStockTCPerHa: number;
  totalCurrentCarbonStockPerHa?: number;
  netCarbonStockDeltaTCPerHa: number;
  grossSequesteredTCO2e: number;
  totalGrossSequestrationTCO2e?: number;
  permanenceBufferPoolTCO2e: number;
  bufferPoolDeductionTCO2e?: number;
  netIssuableCreditsTCO2e: number;
  reportSha256Hash: string;
  calculatedAt: string;
}

export interface FieldInspectionReport {
  officerName: string;
  officerWallet: string;
  officerDesignation: string;
  inspectedAt: string;
  gpsGroundTruthVerified: boolean;
  canopyVigorScore: number;
  soilCoreSampleRef: string;
  droneFlightRef: string;
  fieldNotes: string;
  inspectionStatus: 'approved' | 'rejected' | 'pending';
  fieldReportHash: string;
}

export interface EvidenceFile {
  id: string;
  title: string;
  fileType: 'point_cloud_lidar' | 'satellite_multispectral' | 'soil_core_chromatography' | 'drone_orthomosaic' | 'field_survey_pdf';
  ipfsHash: string;
  fileSizeMb: number;
  uploadedAt: string;
  verified: boolean;
}

export interface BlockchainTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  type: 'PROJECT_REGISTRATION' | 'FIELD_INSPECTION_SIGN' | 'MRV_VERIFIED' | 'CREDITS_MINTED' | 'CREDITS_TRANSFERRED' | 'CREDITS_RETIRED';
  details: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  ecosystemType: EcosystemType;
  country: string;
  region: string;
  areaHectares: number;
  developerName: string;
  developerWallet: string;
  organization: string;
  status: ProjectStatus;
  registeredDate: string;
  plantingStartDate: string;
  methodology: string;
  dominantSpecies: string[];
  coordinates: GeoCoordinate[];
  centerCoordinate: GeoCoordinate;
  description: string;
  baselineSummary: string;
  evidenceFiles: EvidenceFile[];
  telemetryData?: MangroveTelemetryInput;
  mrvResult?: MRVCalculationResult;
  fieldInspection?: FieldInspectionReport;
  totalCreditsIssued: number;
  totalCreditsRetired: number;
  blockchainTx?: {
    registryTxHash: string;
    fieldSignTxHash?: string;
    verifierTxHash?: string;
    verifierAddress?: string;
    verifierName?: string;
    issuedTokenBatchId?: string;
    serialRange?: string;
  };
}

export interface CreditHolding {
  id: string;
  projectId: string;
  projectName: string;
  batchId: string;
  vintage: number;
  serialRange: string;
  availableCredits: number;
  totalMintedCredits: number;
  retiredCredits: number;
  holderWallet: string;
  ecosystemType: EcosystemType;
  issuanceTxHash: string;
}

export interface RetirementCertificate {
  certificateId: string;
  holdingId: string;
  projectId: string;
  projectName: string;
  batchId: string;
  vintage?: number;
  serialRange: string;
  amountTCO2e: number;
  retireeName: string;
  beneficiary: string;
  reason: string;
  retiredAt: string;
  retiredTimestamp?: string;
  burnerWallet: string;
  burnTxHash: string;
  onChainTxHash?: string;
  immutableCertificateHash: string;
}
