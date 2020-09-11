// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/data/dev.db3",
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      },
    },
    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
  staging: {
    client: "pg",
    connection: {
      database: "postgres",
      host: "127.0.0.1",
      user: "postgres",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: "./src/data/test.db3",
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      },
    },

    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
};
