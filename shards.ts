import { ShardingManager } from 'discord.js';
import dotenv from 'dotenv';
import Logger from './src/utils/Logger';
import * as botPackage from './package.json';

dotenv.config();

// import logo from 'asciiart-logo';

const shardManagerLogger: Logger = new Logger('ShardingManager');

console.debug(botPackage.version);

// shardManagerLogger.info(logo(botPackage).render());
shardManagerLogger.info('Sharding manager starting !');

const token = process.env.TOKEN;
const processArgs = process.argv.slice(2);

// @ts-ignore
new ShardingManager('./dist/main.js', {
  respawn: true,
  totalShards:
    processArgs && parseInt(processArgs[1], 10) && processArgs[0] === '--shard' ? parseInt(processArgs[1], 10) : 'auto',
  token,
}).on('shardCreate', (shard) => {
  shardManagerLogger.info(`Creating Shard #${shard.id}`);
}).spawn().then(() => {
  shardManagerLogger.success('All shards are launched !');
})
  .catch((err) => {
    shardManagerLogger.error(`An error has occurred ! ${err}`);
    return process.exit(1);
  });
