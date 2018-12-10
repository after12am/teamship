'use strict';

const BasicRepository = require('./BasicRepository');
const UserEntity = require('../entities/UserEntity');

/**
 * @description
 */
module.exports = class UserRepository extends BasicRepository {

  /**
   * @description insert or update
   */
  *save(user) {

    if (!(user instanceof UserEntity)) {
      throw new Error('argument has to be instance of UserEntity.');
    }

    const exists = yield* this.exist(user.id);
    if (!exists) {
      yield* this.insert(user);
      return;
    }

    yield* this.update(user);
  }

  /**
   * @description
   */
  *exist(id) {
    const sql = `
      SELECT
        id
      FROM
        users
      WHERE
        id = ?;
    `;
    const data = yield this.conn.query(sql, [
      id
    ]);
    return data.length > 0;
  }

  /**
   * @description
   */
  *insert(user) {

    if (!(user instanceof UserEntity)) {
      throw new Error('argument has to be instance of UserEntity.');
    }

    const sql = `
      INSERT INTO
        users
      SET
        id = ?,
        name = ?;
    `;
    return yield this.conn.query(sql, [
      user.id,
      user.name
    ]);
  }

  /**
   * @description
   */
  *update(user) {

    if (!(user instanceof UserEntity)) {
      throw new Error('argument has to be instance of UserEntity.');
    }

    const sql = `
      UPDATE
        users
      SET
        name = ?
      WHERE id = ?;
    `;
    return yield this.conn.query(sql, [
      user.name,
      user.id
    ]);
  }

  /**
   * @description
   * TODO: pagingつける
   */
  *getAll() {
    const sql = `
      SELECT
        users.id,
        users.name
      FROM
        users;
    `;
    return yield this.conn.query(sql);
  }
};
