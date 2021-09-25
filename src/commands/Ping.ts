import type Context from '../utils/Context';
import Command from '../utils/Command';

class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      category: 'utils',
      description: 'Shows bot latency',
      examples: ['ping', 'help ping'],
    });
  }

  async run(ctx: Context) {
    await ctx.reply({
      embeds: [
        {
          title: '⏱️ | Latency',
          fields: [
            {
              name: 'Bot Latency',
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
