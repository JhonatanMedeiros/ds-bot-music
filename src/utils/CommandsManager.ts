import { resolve } from 'path';
import { access, readdir, stat } from 'fs/promises';
import { Collection, ApplicationCommandManager } from 'discord.js';
import Command from './Command';
// eslint-disable-next-line
import Client from '../../main';

class CommandsManager {
  private _client: typeof Client;

  private readonly _commands: Collection<string, Command>;

  private readonly _path: string;

  private readonly _globalCommands: ApplicationCommandManager;

  constructor(client: typeof Client) {
    this._client = client;
    this._commands = new Collection();
    this._path = resolve(__dirname, '..', 'commands');
    if (!this._client.application) throw new Error('Application is null');
    this._globalCommands = this._client.application.commands;
  }

  get commands() {
    return this._commands;
  }

  addCommand(command: Command) {
    if (!command.disabled) {
      this._commands.set(command.name.toLowerCase(), command);
    }
  }

  findCommand(name: string) {
    if (!name || typeof name !== 'string') return undefined;
    return this._commands.find((cmd) => cmd.name.toLowerCase() === name.toLowerCase());
  }

  async loadCommands() {
    try {
      await access(this._path);
    } catch (error) { return; }

    await this._globalCommands.fetch();

    const categories = await readdir(this._path);

    if (!categories || categories.length > 0) {
      // eslint-disable-next-line
      for (const category of categories) {
        const path = resolve(this._path, category);
        // eslint-disable-next-line
        const stats = await stat(path);

        if (stats.isDirectory()) {
          // eslint-disable-next-line
          const commands = await readdir(path);

          if (commands && commands.length > 0) {
            // eslint-disable-next-line
            for (const command of commands) {
              const cmdPath = resolve(path, command);
              // eslint-disable-next-line
              const cmdStats = await stat(cmdPath);

              if (cmdStats.isFile() && command.endsWith('.js')) {
                // eslint-disable-next-line
                this.addCommand(require(cmdPath));
              }
            }
          }
        } else if (stats.isFile() && path.endsWith('.js')) {
          // eslint-disable-next-line
          this.addCommand(require(path));
        }
      }
    }

    const commandsListTestCmd = this._commands.filter((cmd) => !cmd.testCmd).map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options,
    }));

    const commandsList = this._commands.filter((cmd) => cmd.testCmd).map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options,
    }));

    try {
      await this._globalCommands.set(commandsListTestCmd, this._client.config.testGuild);
      await this._globalCommands.set(commandsList);
    } catch (e) {
      console.log(e);
    }
  }
}

export default CommandsManager;
