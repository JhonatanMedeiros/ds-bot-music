import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Resume extends Command {
  constructor() {
    super({
      name: 'resume',
      category: 'Música',
      description: 'Retomar a música atual',
      examples: ['resume', 'help resume'],
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
    const paused = queue.setPaused(false);
    await interaction.followUp({ content: !paused ? '❌ | Algo deu errado!' : '▶ | Retomada!' });
  }
}

module.exports = new Resume();
