const ArrayLib = artifacts.require('./libs/ArrayLib')
const NodeCertificate = artifacts.require('./NodeCertificate')

module.exports = function (deployer) {
  deployer.deploy(ArrayLib)
  deployer.link(ArrayLib, [ NodeCertificate ])
  deployer.deploy(NodeCertificate)
}
