
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('signers', function(table) {
      table.string('target').notNullable().references('id').inTable('entities');
      table.string('signer').notNullable().references('id').inTable('entities');
      table.timestamps();
    })

  ]);

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('signers')
  ]);
};
