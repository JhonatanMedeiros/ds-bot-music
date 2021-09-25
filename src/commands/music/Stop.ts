import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Stop extends Command {
  constructor() {
    super({
      name: 'stop',
      category: 'music',
      description: 'Stop the player',
      examples: ['stop', 'help stop'],
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
    queue.destroy();
    await interaction.followUp({ content: '🛑 | Stopped the player!' });
  }
}

module.exports = new Stop();
