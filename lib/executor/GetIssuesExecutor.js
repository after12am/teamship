'use strict';

const Promise = require('bluebird');
const co = Promise.coroutine;
const GithubExecutor = require('./GithubExecutor');
const UserEntity = require('../entities/UserEntity');
const IssueEntity = require('../entities/IssueEntity');
const UserRepository = require('../repositories/UserRepository');
const RepoRepository = require('../repositories/RepoRepository');
const IssuesRepository = require('../repositories/IssuesRepository');

/**
 * @description
 */
module.exports = class GetIssuesExecutor extends GithubExecutor {

  /**
   * @description
   */
  constructor() {
    super();
    this._save = this._save.bind(this);
  }

  /**
   * @description
   */
  *execute() {
    try {

      this.repoRepository = new RepoRepository();
      this.issuesRepository = new IssuesRepository();
      this.userRepository = new UserRepository();

      const repos = yield* this.repoRepository.getAll();

      for (var i in repos) {
        const repo = repos[i];
        const params = {
          owner: repo.owner,
          repo: repo.name,
          // since: lastUpdated || '1970-01-01T00:00:00+09:00', // うまく動作しない
          page: 1,
          per_page: 100
        }

        while (1) {
          console.log(params);
          let response;
          try {
            response = yield this.github.getIssuesForRepo(params);
          } catch (error) {
            this.emit('error', error);
            break;
          }

          for (const i in response.data) {
            const isPr = !!response.data[i].pull_request;
            if (isPr) continue;
            yield* this._save(repo, response.data[i]);
          }

          if (response.data.length === 0 || response.data.length < params.per_page) break;

          params.page++;
        }
      }

    } catch (error) {

      this.emit('error', error);

    } finally {

      this.repoRepository.close();
      this.issuesRepository.close();
      this.userRepository.close();
      this.emit('end');

    }
  }

  /**
   * @description リポジトリ情報をデータベースに保存します。
   */
  *_save(repo, data) {
    const user = new UserEntity(
      data.user.id,
      data.user.login
    );
    yield* this.userRepository.save(user);

    const issue = new IssueEntity(
      data.id,
      repo.id,
      data.number,
      data.user.id,
      data.state,
      data,
      data.created_at,
      data.updated_at,
      data.closed_at,
    );
    yield* this.issuesRepository.save(issue);
  }
};
