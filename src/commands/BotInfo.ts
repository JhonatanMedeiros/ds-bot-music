import { Collection } from 'discord.js';
import Command from '../utils/Command';
import Context from '../utils/Context';

class Botinfo extends Command {
  constructor() {
    super({
      name: 'botinfo',
      category: 'Utilidades',
      description: 'Mostra as informações do bot.',
      ownerOnly: true,
      options: [],
      disabled: false,
    });
  }

  async run(ctx: Context) {
    const [guilds, users] = await Promise.all<Collection<any, number>, Collection<any, number>>([
      // @ts-ignore
      ctx.shards.fetchClientValues('guilds.cache.size'),
      // @ts-ignore
      ctx.shards.fetchClientValues('users.cache.size'),
    ]);

    await ctx.reply({
      embeds: [{
        thumbnail: {
          url: ctx?.client?.user?.displayAvatarURL({ size: 512, dynamic: true }),
        },
        title: 'Bot info',
        fields: [
          {
            name: 'Servidores',
            value: `\`${guilds.reduce((acc, count) => acc + count, 0)}\``,
            // value: "`" + guilds.reduce((acc, guild) => acc + count, 0) + "`",
            inline: true,
          },
          {
            name: 'Comercial',
            value: `\`${users.reduce((acc, count) => acc + count, 0)}\``,
            inline: true,
          },
          {
            name: 'Ram',
            value: '`' + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB` + '`',
            inline: true,
          },
          {
            name: 'Shards',
            value: `\`${ctx.shards.count}\``,
            inline: true,
          },
        ],
      }],
    });
  }
}

module.exports = new Botinfo();
