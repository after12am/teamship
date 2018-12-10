'use strict';

/*
  @description このコマンドは、Githubからissueを取得して、データベースに保存します。
*/

const Promise = require('bluebird');
const co = require('co');
const GetIssuesExecutor = require('../lib/executor/GetIssuesExecutor');

/**
 * @description メイン処理
 */
function main() {
  return new Promise((resolve, reject) => {

    const executor = new GetIssuesExecutor();

    executor.on('error', (error) => {
      console.error(error);
    });

    executor.on('end', () => {
      console.log('done with execute to get issues.');
      executor.removeAllListeners();
      resolve();
    });

    console.log('start getting issues.');
    return co(executor.execute);
  });
}

if (require.main === module) return main();
module.exports = main;
