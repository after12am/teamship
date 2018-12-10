'use strict';

const moment = require('moment');
const BasicRepository = require('./BasicRepository');
const IssueEntity = require('../entities/IssueEntity');

/**
 * @description
 */
module.exports = class IssuesRepository extends BasicRepository {

  /**
   * @description insert or update
   */
  *save(issue) {

    if (!(issue instanceof IssueEntity)) {
      throw new Error('argument has to be instance of IssueEntity.');
    }

    const exists = yield* this.exist(issue.id);
    if (!exists) {
      yield* this.insert(issue);
      return;
    }

    yield* this.update(issue);
  }

  /**
   * @description
   */
  *exist(id) {
    const sql = `
      SELECT
        id
      FROM
        issues
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
  *insert(issue) {

    if (!(issue instanceof IssueEntity)) {
      throw new Error('argument has to be instance of IssueEntity.');
    }

    const sql = `
      INSERT INTO
        issues
      SET
        id = ?,
        repository_id = ?,
        number = ?,
        creator_id = ?,
        state = ?,
        body = ?,
        created_at = ?,
        updated_at = ?,
        closed_at = ?;
    `;
    return yield this.conn.query(sql, [
      issue.id,
      issue.repositoryId,
      issue.number,
      issue.creatorId,
      issue.state,
      JSON.stringify(issue.body),
      issue.createdAt,
      issue.updatedAt,
      issue.closedAt
    ]);
  }

  /**
   * @description
   */
  *update(issue) {

    if (!(issue instanceof IssueEntity)) {
      throw new Error('argument has to be instance of IssueEntity.');
    }

    const sql = `
      UPDATE
        issues
      SET
        repository_id = ?,
        number = ?,
        creator_id = ?,
        state = ?,
        body = ?,
        created_at = ?,
        updated_at = ?,
        closed_at = ?
      WHERE
        id = ?;
    `;
    return yield this.conn.query(sql, [
      issue.repositoryId,
      issue.number,
      issue.creatorId,
      issue.state,
      JSON.stringify(issue.body),
      issue.createdAt,
      issue.updatedAt,
      issue.closedAt,
      issue.id
    ]);
  }

  /**
   * @description
   */
  *calculateForEachUser(start, end) {
    const sql = `
      SELECT
        users.name AS reviewer,
        count(users.name) AS count
      FROM
        issues
      INNER JOIN
        users ON issues.creator_id = users.id
      WHERE
          issues.closed_at >= ?
      AND issues.closed_at < ?
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
        issues.number,
        users.name AS owner
      FROM
        issues
      INNER JOIN
        repositories ON issues.repository_id = repositories.id
      INNER JOIN
        users ON repositories.owner_id = users.id;
    `;
    return yield this.conn.query(sql);
  }
};
