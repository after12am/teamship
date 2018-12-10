'use strict';

/*
  Githubリポジトリ情報をデータベースに保存します。
*/

const Promise = require('bluebird');
const co = require('co');
const GetRepositoryExecutor = require('../lib/executor/GetRepositoryExecutor');


/**
 * @description メイン処理
 */
function main() {
  return new Promise((resolve, reject) => {

    const executor = new GetRepositoryExecutor();

    executor.on('error', (error) => {
      console.error(error);
    });

    executor.on('end', () => {
      console.log('done with execute to get repositories.');
      executor.removeAllListeners();
      resolve();
    });

    console.log('start getting repositories.');
    return co(executor.execute);
  });
}

if (require.main === module) return main();
module.exports = main;
