import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class BassBoost extends Command {
  constructor() {
    super({
      name: 'grave',
      category: 'Música',
      description: 'Alterna filtro de reforço de graves',
      examples: ['grave', 'help grave'],
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
    await queue.setFilters({
      bassboost: !queue.getFiltersEnabled().includes('bassboost'),
      normalizer2: !queue.getFiltersEnabled().includes('bassboost'), // because we need to toggle it with bass
    });

    await interaction.followUp({
      content: `🎵 | Grave ${queue.getFiltersEnabled().includes('bassboost') ? 'Habilitado' : 'Desabilitado'}!`,
    });
  }
}

module.exports = new BassBoost();
