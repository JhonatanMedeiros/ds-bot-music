import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Volume extends Command {
  constructor() {
    super({
      name: 'volume',
      category: 'music',
      description: 'Sets music volume',
      options: [
        {
          name: 'amount',
          type: 'INTEGER',
          description: 'The volume amount to set (0-100)',
          required: false,
        },
      ],
      examples: ['volume', 'help volume'],
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

    const vol = (interaction as any).options.get('amount');
    if (!vol) {
      await interaction.followUp({ content: `🎧 | Current volume is **${queue.volume}**%!` });
      return;
    }
    if ((vol.value) < 0 || (vol.value) > 100) {
      await interaction.followUp({ content: '❌ | Volume range must be 0-100' });
      return;
    }
    const success = queue.setVolume(vol.value);
    await interaction.followUp({
      content: success ? `✅ | Volume set to **${vol.value}%**!` : '❌ | Something went wrong!',
    });
  }
}

module.exports = new Volume();
