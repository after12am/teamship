'use strict';

/*
  @description このコマンドは、Githubからissueのコメントを取得して、データベースに保存します。
*/

const Promise = require('bluebird');
const co = require('co');
const GetIssuesCommentsExecutor = require('../lib/executor/GetIssuesCommentsExecutor');

/**
 * @description メイン処理
 */
function main() {
  return new Promise((resolve, reject) => {

    const executor = new GetIssuesCommentsExecutor();

    executor.on('error', (error) => {
      console.error(error);
    });

    executor.on('end', () => {
      console.log('done with execute to get comments of issues.');
      executor.removeAllListeners();
      resolve();
    });

    console.log('start getting comments of issues.');
    return co(executor.execute);
  });
}

if (require.main === module) return main();
module.exports = main;
