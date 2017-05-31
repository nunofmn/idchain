
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('certificates', function(table) {
      table.integer('id').primary();
      table.string('signer').references('id').inTable('entities');
      table.string('ipAddress');
      table.string('publicKey');
      table.string('peerID');
      table.string('blockstamp');
      table.boolean('valid');
    })
  ]);
};

exports.down = function(knex, Promise) {

  return Promise.all([
    knex.schema.dropTable('certificates')
  ]);
};
