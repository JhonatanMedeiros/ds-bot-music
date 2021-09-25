import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class BassBoost extends Command {
  constructor() {
    super({
      name: 'bassboost',
      category: 'music',
      description: 'Toggles bassboost filter',
      examples: ['bassboost', 'help bassboost'],
    });
  }

  async run(ctx: Context) {
    const { interaction, client } = ctx;
    const { player } = client.playerManager;
    await interaction.deferReply();
    const queue = player.getQueue<PlayerMetadata>(interaction?.guildId as any);

    if (!queue || !queue.playing) {
      await interaction.followUp({ content: '❌ | No music is being played!' });
      return;
    }
    await queue.setFilters({
      bassboost: !queue.getFiltersEnabled().includes('bassboost'),
      normalizer2: !queue.getFiltersEnabled().includes('bassboost'), // because we need to toggle it with bass
    });

    await interaction.followUp({
      content: `🎵 | Bassboost ${queue.getFiltersEnabled().includes('bassboost') ? 'Enabled' : 'Disabled'}!`
    });
  }
}

module.exports = new BassBoost();
