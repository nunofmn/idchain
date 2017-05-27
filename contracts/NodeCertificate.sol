contract NodeCertificate {

    struct Certificate {
        string ipAddress;
        string publicKey;
        uint date;
        uint id;
        bool valid;
        address signer;
    }

    struct Entity {
        string name;
        address[] signers;
        address[] signed;
        bool created;
    }

    uint counterId;
    uint[] revocations;
    mapping (string => Certificate) certificates;
    mapping (address => Entity) entities;

    event SignCertificate(
        address indexed entity,
        address indexed target,
        uint indexed timestamp
    );

    event UnsignCertificate(
        address indexed entity,
        address indexed target,
        uint indexed timestamp
    );

    event CreateCertificate(
        address indexed entity,
        uint indexed id,
        uint indexed timestamp,
        string ip,
        string peer,
        string pk,
        bool valid
    );

    event RevokeCertificate(
        address indexed entity,
        uint indexed timestamp,
        string indexed peer
    );

    event EntityInit(
        address indexed entity,
        uint indexed timestamp,
        string name
    );

    function NodeCertificate() {
        counterId = 0;
    }

    function initEntity(string name) {
        if(!entities[msg.sender].created) {
            entities[msg.sender].name = name;
            entities[msg.sender].created = true;
        } else{
            throw;
        }

        EntityInit(msg.sender, block.timestamp, name);
    }

    function newCertificate(string publicKey, string ipAddress, string peerID) returns (uint) {
        certificates[peerID].publicKey = publicKey;
        certificates[peerID].date = block.timestamp;
        certificates[peerID].id = counterId;
        certificates[peerID].valid = true;
        certificates[peerID].ipAddress = ipAddress;
        certificates[peerID].signer = msg.sender;

        CreateCertificate(msg.sender, counterId, block.timestamp, ipAddress, peerID, publicKey, true);

        counterId++;

        return certificates[peerID].id;
    }

    function getCertificate(string peerID) returns (string publicKey, string ipAddress, uint date, uint id, bool valid, address signer) {
        publicKey = certificates[peerID].publicKey;
        ipAddress = certificates[peerID].ipAddress;
        date = certificates[peerID].date;
        id = certificates[peerID].id;
        valid = certificates[peerID].valid;
        signer = certificates[peerID].signer;
    }

    function revokeCertificate(string peerID) {
        if(certificates[peerID].signer == msg.sender && certificates[peerID].valid) {
            certificates[peerID].valid = false;
            revocations.push(certificates[peerID].id);
            RevokeCertificate(msg.sender, block.timestamp, peerID);
        }else {
            throw;
        }
    }

    function updateCertificate(string peerID, string publickey, string ipAddress) {
        if(certificates[peerID].signer == msg.sender) {
            certificates[peerID].ipAddress = ipAddress;
            certificates[peerID].publicKey = publickey;
            certificates[peerID].valid = true;
            certificates[peerID].id = counterId;
            certificates[peerID].date = block.timestamp;
            counterId++;
        }
    }

    function signCertificate(address entity) {
        entities[entity].signers.push(msg.sender);
        entities[msg.sender].signed.push(entity);

        SignCertificate(msg.sender, entity, block.timestamp);
    }

    function unsignCertificate(address entity) {
        // Best place?
        UnsignCertificate(msg.sender, entity, block.timestamp);

        for(uint i=0; i < entities[entity].signers.length; i++) {
            if(entities[entity].signers[i] == msg.sender) {
                delete entities[entity].signers[i];
                return;
            }
        }

        for(uint j=0; j < entities[msg.sender].signed.length; j++) {
            if(entities[msg.sender].signed[j] == msg.sender) {
                delete entities[msg.sender].signed[i];
                return;
            }
        }

    }

    function getSigners(address entity) returns (address[]){
        return entities[entity].signers;
    }
}
