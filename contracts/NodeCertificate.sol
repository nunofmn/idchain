pragma solidity ^0.4.11;

contract NodeCertificate {

    struct Certificate {
        string ipAddress;
        string peerId;
        string fingerprint;
        uint date;
        uint id;
        bool valid;
        address signer;
    }

    struct Entity {
        string name;
        address[] signers;
        address[] signed;
        Certificate[] certificates;
        bool created;
        bool valid;
        bool bootstraper;
    }

    uint counterId;
    uint[] revocations;
    uint bootstrapersCount;
    mapping (string => Certificate) certificates;
    mapping (address => Entity) entities;

    event SignEntity(
        address indexed entity,
        address indexed target,
        uint indexed timestamp
    );

    event UnsignEntity(
        address indexed entity,
        address indexed target,
        uint indexed timestamp
    );

    event InvalidateEntity(
        address indexed entity,
        uint indexed timestamp
    );

    event ValidateEntity(
        address indexed entity,
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
        string name,
        bool valid
    );

    function NodeCertificate() {
        counterId = 0;
        bootstrapersCount = 0;
    }

    function initEntity(string name) {
        if(!entities[msg.sender].created) {
            entities[msg.sender].name = name;
            entities[msg.sender].created = true;

            if(bootstrapersCount < 3) {
              entities[msg.sender].bootstraper = true;
              entities[msg.sender].valid = true;
              bootstrapersCount++;
            } else {
              entities[msg.sender].bootstraper = false;
              entities[msg.sender].valid = false;
            }
        } else{
            throw;
        }

        EntityInit(msg.sender, block.timestamp, name, false);
    }

    function getEntityStatus(address entity) returns (bool) {
      if(entities[entity].created) {
        return entities[entity].valid;
      } else{
        throw;
      }
    }

    function isEntityBootstraper(address entity) returns (bool) {
      if(entities[entity].created) {
        return entities[entity].bootstraper;
      } else{
        throw;
      }
    }

    function newCertificate(string fingerprint, string ipAddress, string peerID) returns (uint) {
        certificates[peerID].fingerprint = fingerprint;
        certificates[peerID].date = block.timestamp;
        certificates[peerID].id = counterId;
        certificates[peerID].valid = true;
        certificates[peerID].ipAddress = ipAddress;
        certificates[peerID].peerId = peerID;
        certificates[peerID].signer = msg.sender;

        entities[msg.sender].certificates.push(certificates[peerID]);

        CreateCertificate(msg.sender, counterId, block.timestamp, ipAddress, peerID, fingerprint, true);

        counterId++;

        return certificates[peerID].id;
    }

    function getCertificate(string peerID) returns (string fingerprint, string ipAddress, uint date, uint id, bool valid, address signer) {
        fingerprint = certificates[peerID].fingerprint;
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

    function updateCertificate(string peerID, string fingerprint, string ipAddress) {
        if(certificates[peerID].signer == msg.sender) {
            certificates[peerID].ipAddress = ipAddress;
            certificates[peerID].fingerprint = fingerprint;
            certificates[peerID].valid = true;
            certificates[peerID].id = counterId;
            certificates[peerID].date = block.timestamp;
            counterId++;
        }
    }

    function signEntity(address entity) {
        entities[entity].signers.push(msg.sender);
        entities[msg.sender].signed.push(entity);

        SignEntity(msg.sender, entity, block.timestamp);

        checkValidity(entity);
    }

    function unsignEntity(address entity) {
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

        UnsignEntity(msg.sender, entity, block.timestamp);

        checkValidity(entity);
    }

    function checkValidity(address entity) {
      if(entities[entity].signers.length < 3 && !entities[entity].bootstraper) {
        entities[entity].valid = false;

        for(uint i=0; i < entities[entity].signed.length; i++) {
          checkValidity(entities[entity].signed[i]);
        }

        InvalidateEntity(entity, block.timestamp);
      } else if(entities[entity].signers.length >= 3 && !entities[entity].valid){
        entities[entity].valid = true;

        for(uint j=0; j < entities[entity].signed.length; j++) {
          checkValidity(entities[entity].signed[j]);
        }

        ValidateEntity(entity, block.timestamp);
      }

      return;
    }

    function getSigners(address entity) returns (address[]){
        return entities[entity].signers;
    }
}
