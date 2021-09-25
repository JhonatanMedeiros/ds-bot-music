import type { Interaction } from 'discord.js';
import type Client from '../../main';
import CommandService from '../services/CommandService';
import DiscordEvent from '../utils/DiscordEvent';

class InteractionCreate extends DiscordEvent {
  commands: CommandService;

  constructor(client: typeof Client) {
    super(client, 'interactionCreate', 'InteractionCreate');
    this.client = client;
    this.commands = new CommandService(this.client);
  }

  async run(interaction: Interaction) {
    if (interaction.isCommand()) await this.commands.handle(interaction);
  }
}

module.exports = InteractionCreate;
