import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Stop extends Command {
  constructor() {
    super({
      name: 'stop',
      category: 'Música',
      description: 'Parar a Música',
      examples: ['stop', 'help stop'],
    });
  }

  async run(ctx: Context) {
    const { interaction, client } = ctx;
    const { player } = client.playerManager;
    await interaction.deferReply();
    const queue = player.getQueue<PlayerMetadata>(interaction?.guildId as any);

    if (!queue || !queue.playing) {
      await interaction.followUp({ content: '❌ | Nenhuma música está sendo tocada!' });
      return;
    }
    queue.destroy();
    await interaction.followUp({ content: '🛑 | Parou a música!' });
  }
}

module.exports = new Stop();
