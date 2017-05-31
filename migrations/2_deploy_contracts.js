const NodeCertificate = artifacts.require('./NodeCertificate')

module.exports = function (deployer) {
  deployer.deploy(NodeCertificate)
}
