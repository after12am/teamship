'use strict';

/*
  Githubリポジトリ情報をデータベースに保存します。
*/

const Promise = require('bluebird');
const co = require('co');
const GetPullRequestsExecutor = require('../lib/executor/GetPullRequestsExecutor');


/**
 * @description メイン処理
 */
function main() {
  return new Promise((resolve, reject) => {

    const executor = new GetPullRequestsExecutor();

    executor.on('error', (error) => {
      console.error(error);
    });

    executor.on('end', () => {
      console.log('done with execute to get pull requests.');
      executor.removeAllListeners();
      resolve();
    });

    console.log('start getting pull requests.');
    return co(executor.execute);
  })
}

if (require.main === module) return main();
module.exports = main;
