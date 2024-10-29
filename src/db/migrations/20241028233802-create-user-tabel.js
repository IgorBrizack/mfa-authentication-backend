"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `
      CREATE TABLE users (
        user_token CHAR(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        mfa_config JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (user_token)
      );
      `
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE users;`);
  },
};
