// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'nunofmn1'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db_migrations',
      tableName: 'migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'rethink'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db_migrations',
      tableName: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'rethink'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db_migrations',
      tableName: 'migrations'
    }
  }
}
