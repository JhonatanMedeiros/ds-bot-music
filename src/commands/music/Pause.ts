import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Pause extends Command {
  constructor() {
    super({
      name: 'pause',
      category: 'Música',
      description: 'Pausar a música atual',
      examples: ['pause', 'help pause'],
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
    const paused = queue.setPaused(true);
    await interaction.followUp({ content: paused ? '⏸ | Pausado!' : '❌ | Algo deu errado!' });
  }
}

module.exports = new Pause();
