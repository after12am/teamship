'use strict';

const Promise = require('bluebird');
const GithubExecutor = require('./GithubExecutor');
const PullsEntity = require('../entities/PullsEntity');
const RepoRepository = require('../repositories/RepoRepository');
const PullsRepository = require('../repositories/PullsRepository');

/**
 * @description
 */
module.exports = class GetPullRequestsExecutor extends GithubExecutor {

  /**
   * @description
   * TODO: BusinessExecutionError
   */
  *execute() {
    try {

      this.repoRepository = new RepoRepository();
      this.pullsRepository = new PullsRepository();

      const repos = yield* this.repoRepository.getAll();

      for (var i in repos) {

        const repo = repos[i];
        const params = {
          owner: repo.owner,
          repo: repo.name,
          page: 1,
          per_page: 100
        };

        while (1) {
          console.log(params);
          let response;
          try {
            response = yield this.github.getPullRequests(params);
          } catch (error) {
            this.emit('error', error);
            break;
          }

          for (const i in response.data) {
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
      this.pullsRepository.close();
      this.emit('end');

    }
  }

  /**
   * @description リポジトリ情報をデータベースに保存します。
   * @private
   */
  *_save(repo, data) {
    const pull = new PullsEntity(
      data.id,
      repo.id,
      data.number,
      data.user.id,
      data.state,
      data,
      data.created_at,
      data.updated_at,
      data.closed_at,
      data.merged_at
    );
    yield* this.pullsRepository.save(pull);
  }
};
