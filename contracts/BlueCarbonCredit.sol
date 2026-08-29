// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BlueCarbonCredit
 * @dev Tokenized Blue Carbon Credits with immutable retirement certificate recording.
 * 1 Credit = 1 Metric Tonne of CO2 equivalent (tCO2e) sequestered in coastal ecosystems.
 */
contract BlueCarbonCredit {
    string public name = "Blue Carbon Tokenized Credit";
    string public symbol = "BCT";
    uint8 public decimals = 2; // Supports fractional credits down to 0.01 tCO2e

    address public registryContract;
    address public admin;

    struct CreditBatch {
        string batchId;
        string projectId;
        string vintage;
        uint256 totalIssued;
        uint256 availableBalance;
        string reportHash;
        uint256 issuedTimestamp;
    }

    struct RetirementCertificate {
        string certificateId;
        string projectId;
        string vintage;
        address retiree;
        string beneficiary;
        string retirementReason;
        uint256 amount; // Scaled by decimals (100 = 1.00 tCO2e)
        uint256 retirementTimestamp;
        bytes32 transactionDigest;
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply;
    uint256 public totalRetired;

    mapping(string => CreditBatch) public batches;
    mapping(string => RetirementCertificate) public certificates;
    string[] public certificateIds;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event CreditsMinted(string indexed batchId, string indexed projectId, address indexed recipient, uint256 amount, string reportHash);
    event CreditsRetired(string indexed certificateId, string indexed projectId, address indexed retiree, string beneficiary, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address _registryContract) {
        admin = msg.sender;
        registryContract = _registryContract;
    }

    function mintVerifiedCredits(
        string memory batchId,
        string memory projectId,
        string memory vintage,
        address recipient,
        uint256 amount,
        string memory reportHash
    ) external onlyAdmin {
        require(amount > 0, "Amount must be greater than zero");
        
        totalSupply += amount;
        balanceOf[recipient] += amount;

        batches[batchId] = CreditBatch({
            batchId: batchId,
            projectId: projectId,
            vintage: vintage,
            totalIssued: amount,
            availableBalance: amount,
            reportHash: reportHash,
            issuedTimestamp: block.timestamp
        });

        emit Transfer(address(0), recipient, amount);
        emit CreditsMinted(batchId, projectId, recipient, amount, reportHash);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient credit balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    /**
     * @dev Permanently burns credits and mints a verifiable on-chain retirement record.
     * Prevents double-claiming and greenwashing.
     */
    function retireCredits(
        string memory certificateId,
        string memory projectId,
        string memory vintage,
        uint256 amount,
        string memory beneficiary,
        string memory retirementReason
    ) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient credits to retire");
        require(amount > 0, "Amount must be positive");
        require(bytes(certificates[certificateId].certificateId).length == 0, "Certificate ID already exists");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        totalRetired += amount;

        bytes32 digest = keccak256(abi.encodePacked(certificateId, projectId, msg.sender, beneficiary, amount, block.timestamp));

        certificates[certificateId] = RetirementCertificate({
            certificateId: certificateId,
            projectId: projectId,
            vintage: vintage,
            retiree: msg.sender,
            beneficiary: beneficiary,
            retirementReason: retirementReason,
            amount: amount,
            retirementTimestamp: block.timestamp,
            transactionDigest: digest
        });

        certificateIds.push(certificateId);

        emit Transfer(msg.sender, address(0), amount);
        emit CreditsRetired(certificateId, projectId, msg.sender, beneficiary, amount);

        return true;
    }

    function getCertificate(string memory certificateId) external view returns (RetirementCertificate memory) {
        return certificates[certificateId];
    }

    function getAllCertificateIds() external view returns (string[] memory) {
        return certificateIds;
    }
}
