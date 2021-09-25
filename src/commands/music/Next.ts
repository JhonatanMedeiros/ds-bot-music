import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Next extends Command {
  constructor() {
    super({
      name: 'next',
      category: 'music',
      description: 'Next to the current song',
      examples: ['next', 'help next'],
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
    const currentTrack = queue.current;
    const success = queue.skip();
    await interaction.followUp({
      content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
    });
  }
}

module.exports = new Next();
