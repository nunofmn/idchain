pragma solidity ^0.4.11;

import "./libs/ArrayLib.sol";

contract NodeCertificate {

  struct Certificate {
    string ipAddress;
    string peerId;
    string fingerprint;
    uint date;
    uint id;
    address signer;
    bool revoked;
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

  event EntityStatusChange(
    address indexed entity,
    uint indexed timestamp,
    bool valid
  );

  event CreateCertificate(
    address indexed entity,
    uint indexed id,
    uint indexed timestamp,
    string ip,
    string peer,
    string pk,
    bool revoked
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
    bool bootstraper,
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
        EntityInit(msg.sender, block.timestamp, name, true, true);
      } else {
        entities[msg.sender].bootstraper = false;
        entities[msg.sender].valid = false;
        EntityInit(msg.sender, block.timestamp, name, false, false);
      }
    } else{
      throw;
    }

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
    certificates[peerID].ipAddress = ipAddress;
    certificates[peerID].peerId = peerID;
    certificates[peerID].revoked = false;
    certificates[peerID].signer = msg.sender;

    entities[msg.sender].certificates.push(certificates[peerID]);

    CreateCertificate(msg.sender, counterId, block.timestamp, ipAddress, peerID, fingerprint, false);

    counterId++;

    return certificates[peerID].id;
  }

  function getCertificate(string peerID) returns (string fingerprint, string ipAddress, uint date, uint id, bool valid, bool revoked, address signer) {
    Certificate cert = certificates[peerID];

    fingerprint = cert.fingerprint;
    ipAddress = cert.ipAddress;
    date = cert.date;
    id = cert.id;
    valid = entities[cert.signer].valid;
    revoked = cert.revoked;
    signer = cert.signer;
  }

  function revokeCertificate(string peerID) {
    if(certificates[peerID].signer == msg.sender && !certificates[peerID].revoked) {
      certificates[peerID].revoked = true;
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
      certificates[peerID].id = counterId;
      certificates[peerID].date = block.timestamp;
      counterId++;
    }
  }

  function signEntity(address entity) {
    entities[entity].signers.push(msg.sender);
    entities[msg.sender].signed.push(entity);

    SignEntity(msg.sender, entity, block.timestamp);

    checkValidity(true, entity);
  }

  function unsignEntity(address entity) {
    for(uint i=0; i < entities[entity].signers.length; i++) {
      if(entities[entity].signers[i] == msg.sender) {
        ArrayLib.removeAddress(i, entities[entity].signers);
        break;
      }
    }

    for(uint j=0; j < entities[msg.sender].signed.length; j++) {
      if(entities[msg.sender].signed[j] == msg.sender) {
        ArrayLib.removeAddress(j, entities[msg.sender].signed);
        break;
      }
    }

    UnsignEntity(msg.sender, entity, block.timestamp);

    checkValidity(false, entity);
  }

  function checkValidity(bool previousEntityState, address entity) {

    if(entities[entity].signers.length <= 3 && !previousEntityState && !entities[entity].bootstraper) {

      entities[entity].valid = false;

      for(uint i=0; i < entities[entity].signed.length; i++) {
        checkValidity(false, entities[entity].signed[i]);
      }

      EntityStatusChange(entity, block.timestamp, false);
    } else if(entities[entity].signers.length >= 2 && previousEntityState && !entities[entity].valid){
      entities[entity].valid = true;

      for(uint j=0; j < entities[entity].signed.length; j++) {
        checkValidity(true, entities[entity].signed[j]);
      }

      EntityStatusChange(entity, block.timestamp, true);
    }

    return;
  }

  function getSigners(address entity) returns (address[]){
    return entities[entity].signers;
  }
}
