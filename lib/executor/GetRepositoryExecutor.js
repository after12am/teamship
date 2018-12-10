'use strict';

const Promise = require('bluebird');
const GithubExecutor = require('./GithubExecutor');
const UserEntity = require('../entities/UserEntity');
const RepoEntity = require('../entities/RepoEntity');
const UserRepository = require('../repositories/UserRepository');
const RepoRepository = require('../repositories/RepoRepository');

/**
 * @description
 */
module.exports = class GetRepositoryExecutor extends GithubExecutor {

  /**
   * @description
   * TODO: BusinessExecutionError
   */
  *execute() {
    try {

      this.userRepository = new UserRepository();
      this.repoRepository = new RepoRepository();

      const params = {
        type: 'all',
        page: 1,
        per_page: 100
      };

      let repositories = [];

      while (1) {
        console.log(params);
        const response = yield this.github.getRepositories(params);

        response.data.map((data) => {
          repositories.push(data);
        });

        if (response.data.length === 0 || response.data.length < params.per_page) break;

        params.page++;
      }

      yield* this._save(repositories);

    } catch (error) {

      this.emit('error', error);

    } finally {

      this.userRepository.close();
      this.repoRepository.close();
      this.emit('end');

    }
  }

  /**
   * @description リポジトリ情報をデータベースに保存します。
   * @private
   */
  *_save(repositories) {

    const users = repositories.map((data) => {
      return new UserEntity(
        data.owner.id,
        data.owner.login
      );
    });

    const uniqUsers = [];
    users.forEach((user) => {
      let contains = false;
      for (const i in uniqUsers) {
        if (uniqUsers[i].equals(user)) contains = true;
      }
      if (!contains) uniqUsers.push(user);
    });


    for (const i in uniqUsers) {
      yield* this.userRepository.save(uniqUsers[i]);
    }

    for (const i in repositories) {
      const data = repositories[i];
      const repo = new RepoEntity(
        data.id,
        data.owner.id,
        data.name,
        data.created_at,
        data.updated_at
      );
      yield* this.repoRepository.save(repo);
    }
  }
};
