import {
  CommandInteraction, GuildChannel, GuildMember, Permissions, ThreadChannel,
} from 'discord.js';
import type Client from '../../main';
import Context from '../utils/Context';

class CommandService {
  client: typeof Client;

  constructor(client: typeof Client) {
    this.client = client;
  }

  async handle(interaction: CommandInteraction) {
    if (interaction.user.bot || !interaction.inGuild()) return;

    const { guild } = interaction;

    if (!(interaction.channel instanceof GuildChannel)
      && !(interaction.channel instanceof ThreadChannel)) throw new Error('This is not a GuildTextChannel');
    const channelBotPerms = new Permissions(interaction.channel.permissionsFor(guild?.me as GuildMember));

    // if (!me.hasPermission("SEND_MESSAGES") || !channelBotPerms.has("SEND_MESSAGES")) return;

    const command = this.client.commands.findCommand(interaction.commandName);

    if (!command) return;

    if (command.ownerOnly && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
      await interaction.reply('You can\'t use this command, it\'s for my creator.');
      return;
    }

    if (
      command.userPerms.length > 0
      && !command.userPerms.some((p) => guild?.members?.cache?.get(interaction?.user?.id)?.permissions.has(p))
    ) {
      await interaction.reply(
        `You must have \`${command.userPerms.join('`, `')}\` permissions to execute this command.`,
      );
      return;
    }

    if (!guild?.me?.permissions.has('EMBED_LINKS') || !channelBotPerms.has('EMBED_LINKS')) {
      await interaction.reply('The bot must have the `EMBED_LINKS` permissions to work properly !');
      return;
    }

    if (
      command.botPerms.length > 0
      && !command.botPerms.every((p) => guild?.me?.permissions.has(p) && channelBotPerms.has(p))
    ) {
      await interaction.reply(
        `The bot must have \`${command.botPerms.join('`, `')}\` permissions to execute this command.`,
      );
      return;
    }

    if (command.disabled && !this.client.config.owners.includes(interaction.user.id)) {
      await interaction.reply('Sorry but this command was temporarily disabled.');
      return;
    }

    const ctx = new Context(this.client, interaction);

    try {
      await command.run(ctx);
      this.client.logger.info(`Command ${command.name} executed by ${ctx.member.user.username} in ${ctx.guild.name}`);
    } catch (error) {
      await interaction.reply('Sorry but, an error was occurred.');
      this.client.logger.error(error);
    }
  }
}

export default CommandService;
