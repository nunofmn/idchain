exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('entities', function(table) {
      table.string('id').primary();
      table.string('name');
      table.timestamps();
    }),

    knex.schema.createTable('transactions', function(table) {
      table.string('id').primary();
      table.string('blockstamp');
      table.string('event');
      table.string('entity').references('id').inTable('entities');
      table.json('data');
      table.timestamps();
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('transactions'),
    knex.schema.dropTable('entities')
  ]);
};
