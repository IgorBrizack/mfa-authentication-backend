module.exports = {
  development: {
    username: "root",
    password: "password",
    database: "mydatabase",
    host: "127.0.0.1",
    dialect: "mysql",
    migrationStoragePath: "src/db/migrations",
    port: 3315,
  },
  test: {
    /* configuração de teste */
  },
  production: {
    /* configuração de produção */
  },
};
