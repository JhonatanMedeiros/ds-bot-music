import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Resume extends Command {
  constructor() {
    super({
      name: 'resume',
      category: 'music',
      description: 'Resume the current song',
      examples: ['resume', 'help resume'],
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
    const paused = queue.setPaused(false);
    await interaction.followUp({ content: !paused ? '❌ | Something went wrong!' : '▶ | Resumed!' });
  }
}

module.exports = new Resume();
