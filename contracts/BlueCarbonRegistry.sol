// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BlueCarbonRegistry
 * @dev Registry for Blue Carbon projects, baseline parameters, and immutable MRV verification logs.
 */
contract BlueCarbonRegistry {
    enum ProjectStatus { PENDING_ADMIN, APPROVED, MRV_PROCESSING, VERIFIED, CREDITS_ISSUED, REJECTED }

    struct Project {
        string id;
        string name;
        string ecosystemType; // Mangrove, Seagrass, Salt Marsh
        string country;
        string region;
        uint256 areaHectares; // scaled by 100 (e.g. 14250 = 142.50 ha)
        address developer;
        ProjectStatus status;
        uint256 registeredTimestamp;
        string geoBoundaryHash; // IPFS CID or SHA-256 of GeoJSON
        string methodology; // e.g. VM0033
    }

    struct MRVVerificationRecord {
        string projectId;
        string vintage;
        string reportHash; // SHA-256 digest of MRV telemetry & calculations
        uint256 calculatedTCO2e; // Metric tonnes of CO2 equivalent (scaled by 100)
        uint256 agbBiomass; // Above Ground Biomass (scaled)
        uint256 bgbBiomass; // Below Ground Biomass (scaled)
        uint256 socCarbon;  // Soil Organic Carbon (scaled)
        address verifier;
        uint256 verificationTimestamp;
        string verifierNotes;
        bool isApproved;
    }

    address public registryAdmin;
    mapping(address => bool) public accreditedVerifiers;
    mapping(string => Project) public projects;
    string[] public projectIds;
    
    // projectId => vintage => MRV record
    mapping(string => mapping(string => MRVVerificationRecord)) public mrvRecords;

    event ProjectRegistered(string indexed projectId, string name, address indexed developer, uint256 areaHectares);
    event ProjectStatusUpdated(string indexed projectId, ProjectStatus newStatus);
    event VerifierAccreditationUpdated(address indexed verifier, bool accredited);
    event MRVReportVerified(string indexed projectId, string vintage, string reportHash, uint256 calculatedTCO2e, address indexed verifier);

    modifier onlyAdmin() {
        require(msg.sender == registryAdmin, "Only registry admin can call this");
        _;
    }

    modifier onlyVerifier() {
        require(accreditedVerifiers[msg.sender] || msg.sender == registryAdmin, "Caller is not an accredited verifier");
        _;
    }

    constructor() {
        registryAdmin = msg.sender;
        accreditedVerifiers[msg.sender] = true;
    }

    function setVerifierAccreditation(address verifier, bool accredited) external onlyAdmin {
        accreditedVerifiers[verifier] = accredited;
        emit VerifierAccreditationUpdated(verifier, accredited);
    }

    function registerProject(
        string memory id,
        string memory name,
        string memory ecosystemType,
        string memory country,
        string memory region,
        uint256 areaHectares,
        string memory geoBoundaryHash,
        string memory methodology
    ) external {
        require(bytes(projects[id].id).length == 0, "Project ID already exists");
        
        projects[id] = Project({
            id: id,
            name: name,
            ecosystemType: ecosystemType,
            country: country,
            region: region,
            areaHectares: areaHectares,
            developer: msg.sender,
            status: ProjectStatus.APPROVED, // Default approved for frictionless MVP demo
            registeredTimestamp: block.timestamp,
            geoBoundaryHash: geoBoundaryHash,
            methodology: methodology
        });

        projectIds.push(id);
        emit ProjectRegistered(id, name, msg.sender, areaHectares);
    }

    function updateProjectStatus(string memory id, ProjectStatus newStatus) external onlyAdmin {
        require(bytes(projects[id].id).length != 0, "Project does not exist");
        projects[id].status = newStatus;
        emit ProjectStatusUpdated(id, newStatus);
    }

    function recordMRVVerification(
        string memory projectId,
        string memory vintage,
        string memory reportHash,
        uint256 calculatedTCO2e,
        uint256 agbBiomass,
        uint256 bgbBiomass,
        uint256 socCarbon,
        string memory verifierNotes,
        bool isApproved
    ) external onlyVerifier {
        require(bytes(projects[projectId].id).length != 0, "Project does not exist");
        
        mrvRecords[projectId][vintage] = MRVVerificationRecord({
            projectId: projectId,
            vintage: vintage,
            reportHash: reportHash,
            calculatedTCO2e: calculatedTCO2e,
            agbBiomass: agbBiomass,
            bgbBiomass: bgbBiomass,
            socCarbon: socCarbon,
            verifier: msg.sender,
            verificationTimestamp: block.timestamp,
            verifierNotes: verifierNotes,
            isApproved: isApproved
        });

        if (isApproved) {
            projects[projectId].status = ProjectStatus.VERIFIED;
        }

        emit MRVReportVerified(projectId, vintage, reportHash, calculatedTCO2e, msg.sender);
    }

    function getProject(string memory id) external view returns (Project memory) {
        return projects[id];
    }

    function getAllProjectIds() external view returns (string[] memory) {
        return projectIds;
    }

    function getMRVRecord(string memory projectId, string memory vintage) external view returns (MRVVerificationRecord memory) {
        return mrvRecords[projectId][vintage];
    }
}
