import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Pause extends Command {
  constructor() {
    super({
      name: 'pause',
      category: 'music',
      description: 'Pause the current song',
      examples: ['pause', 'help pause'],
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
    const paused = queue.setPaused(true);
    await interaction.followUp({ content: paused ? '⏸ | Paused!' : '❌ | Something went wrong!' });
  }
}

module.exports = new Pause();
