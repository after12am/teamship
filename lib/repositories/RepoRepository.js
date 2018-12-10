'use strict';

const BasicRepository = require('./BasicRepository');
const RepoEntity = require('../entities/RepoEntity');

/**
 * @description
 */
module.exports = class RepoRepository extends BasicRepository {

  /**
   * @description insert or update
   */
  *save(repo) {

    if (!(repo instanceof RepoEntity)) {
      throw new Error('argument has to be instance of RepoEntity.');
    }

    const exists = yield* this.exist(repo.id);

    if (!exists) {
      yield* this.insert(repo);
      return;
    }

    yield* this.update(repo);
  }

  /**
   * @description
   */
  *exist(id) {
    const sql = `
      SELECT
        id
      FROM
        repositories
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
  *insert(repo) {

    if (!(repo instanceof RepoEntity)) {
      throw new Error('argument has to be instance of RepoEntity.');
    }

    const sql = `
      INSERT INTO
        repositories
      SET
        id = ?,
        owner_id = ?,
        name = ?,
        created_at = ?,
        updated_at = ?;
    `;
    return yield this.conn.query(sql, [
      repo.id,
      repo.ownerId,
      repo.name,
      repo.createdAt,
      repo.updatedAt
    ]);
  }

  /**
   * @description
   */
  *update(repo) {

    if (!(repo instanceof RepoEntity)) {
      throw new Error('argument has to be instance of RepoEntity.');
    }

    const sql = `
      UPDATE
        repositories
      SET
        owner_id = ?,
        name = ?,
        created_at = ?,
        updated_at = ?
      WHERE
          id = ?;
    `;
    return yield this.conn.query(sql, [
      repo.ownerId,
      repo.name,
      repo.createdAt,
      repo.updatedAt,
      repo.id
    ]);
  }

  /**
   * @description
   * TODO: pagingつける
   */
  *getAll() {
    const sql = `
      SELECT
        repos.id AS id,
        repos.name AS name,
        users.id AS ownerId,
        users.name AS owner
      FROM
        repositories AS repos
      INNER JOIN
        users ON repos.owner_id = users.id;
    `;
    return yield this.conn.query(sql);
  }
};
