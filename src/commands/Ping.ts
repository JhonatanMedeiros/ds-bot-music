import type Context from '../utils/Context';
import Command from '../utils/Command';

class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      category: 'Utilidades',
      description: 'Mostra a latência do bot',
      examples: ['ping', 'help ping'],
    });
  }

  async run(ctx: Context) {
    await ctx.reply({
      embeds: [
        {
          title: '⏱️ | Latência',
          fields: [
            {
              name: 'Latência do bot',
              value: `\`${Math.round(ctx.client.ws.ping)}ms\``,
            },
          ],
          color: 0xFFFFFF,
        },
      ],
    });
  }
}

module.exports = new Ping();
