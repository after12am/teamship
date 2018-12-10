'use strict';

const moment = require('moment');
const BasicRepository = require('./BasicRepository');
const PullsEntity = require('../entities/PullsEntity');

/**
 * @description
 */
module.exports = class PullsRepository extends BasicRepository {

  /**
   * @description insert or update
   */
  *save(pull) {

    if (!(pull instanceof PullsEntity)) {
      throw new Error('argument has to be instance of PullsEntity.');
    }

    const exists = yield* this.exist(pull.id);

    if (!exists) {
      yield* this.insert(pull);
      return;
    }

    yield* this.update(pull);
  }

  /**
   * @description
   */
  *exist(id) {
    const sql = `
      SELECT
        id
      FROM
        pulls
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
  *insert(pull) {

    if (!(pull instanceof PullsEntity)) {
      throw new Error('argument has to be instance of PullsEntity.');
    }

    const sql = `
      INSERT INTO
        pulls
      SET
        id = ?,
        repository_id = ?,
        number = ?,
        user_id = ?,
        state = ?,
        body = ?,
        created_at = ?,
        updated_at = ?,
        closed_at = ?,
        merged_at = ?;
    `;
    return yield this.conn.query(sql, [
      pull.id,
      pull.repositoryId,
      pull.number,
      pull.userId,
      pull.state,
      JSON.stringify(pull.body),
      pull.createdAt,
      pull.updatedAt,
      pull.closedAt,
      pull.mergedAt
    ]);
  }

  /**
   * @description
   */
  *update(pull) {

    if (!(pull instanceof PullsEntity)) {
      throw new Error('argument has to be instance of PullsEntity.');
    }

    const sql = `
      UPDATE
        pulls
      SET
        repository_id = ?,
        number = ?,
        user_id = ?,
        state = ?,
        body = ?,
        created_at = ?,
        updated_at = ?,
        closed_at = ?,
        merged_at = ?
      WHERE
        id = ?;
    `;
    return yield this.conn.query(sql, [
      pull.repositoryId,
      pull.number,
      pull.userId,
      pull.state,
      JSON.stringify(pull.body),
      pull.createdAt,
      pull.updatedAt,
      pull.closedAt,
      pull.mergedAt,
      pull.id
    ]);
  }

  /**
   * @description
   */
  *calculateForEachUser(start, end) {
    const sql = `
      SELECT
        users.name AS opener,
        count(users.name) AS count
      FROM
        pulls
      INNER JOIN
        users ON pulls.user_id = users.id
      WHERE
          pulls.merged_at >= ?
      AND pulls.merged_at < ?
      AND state = 'closed'
      GROUP BY
        users.name
    `;
    return yield this.conn.query(sql, [
      start || moment('1970-01-01 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
      end || moment().format('YYYY-MM-DD HH:mm:ss')
    ]);
  }

  /**
   * @description
   * TODO: pagingつける
   */
  *getAll() {
    const sql = `
      SELECT
        repositories.id AS repository_id,
        repositories.name AS repository_name,
        pulls.number,
        users.name AS owner
      FROM
        pulls
      INNER JOIN
        repositories ON pulls.repository_id = repositories.id
      INNER JOIN
        users ON repositories.owner_id = users.id;
    `;
    return yield this.conn.query(sql);
  }
};
