module.exports = {
  development: {
    url: 'postgres://localhost:5432/nunofmn1',
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/nunofmn1_test',
    dialect: 'postgres'
  }
}
