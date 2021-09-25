import {
  Client, Intents, Options, LimitedCollection,
} from 'discord.js';
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-cycle
import CommandsManager from './src/utils/CommandsManager';
import EventsManager from './src/utils/EventsManager';
import Logger from './src/utils/Logger';
import { Config } from './src/models/config';
import * as config from './config.json';

dotenv.config();

class Bot extends Client {
  config: Config;

  logger: Logger;

  events: EventsManager;

  commands!: CommandsManager;

  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
      makeCache: Options.cacheWithLimits({
        MessageManager: {
          sweepInterval: 300,
          sweepFilter: LimitedCollection.filterByLifetime({
            lifetime: 900,
            getComparisonTimestamp: (e) => e?.editedTimestamp ?? e?.createdTimestamp,
          }),
        },
        ThreadManager: {
          sweepInterval: 3600,
          sweepFilter: LimitedCollection.filterByLifetime({
            getComparisonTimestamp: (e: any) => e?.archiveTimestamp,
            excludeFromSweep: (e) => !e.archived,
          }),
        },
      }),
    });
    this.config = config;
    this.logger = new Logger(`Shard #${this.shard?.ids?.toString() ?? '0'}`);
    this.events = new EventsManager(this);

    this.launch().then(() => {
      this.commands = new CommandsManager(this);
      this.commands.loadCommands().then(() => {
        this.logger.success(`[Commands] Loaded ${this.commands?.commands.size} commands`);
        this.logger.success('All was successfully launched');
      }).catch((error: any) => {
        this.logger.error(`[CommandLoadError] An error occurred when loading commands ${error}`, error.stack);
      });
    }).catch((error) => {
      this.logger.error(`[LaunchError] An error occurred at startup ${error}`, error.stack);
    });
  }

  async launch() {
    await this.events.loadEvent();
    this.logger.success(`[Events] Loaded ${this.events.events.size} events`);

    try {
      await this.login(process.env.TOKEN);
      this.logger.success('[WS] Connected to discord');
    } catch (error) {
      this.logger.error(`[WS] Connection error: ${error}`);
      process.exit(1);
      return;
    }
  }
}

export default new Bot();
