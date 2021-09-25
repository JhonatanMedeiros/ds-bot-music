import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Queue extends Command {
  constructor() {
    super({
      name: 'queue',
      category: 'music',
      description: 'See the queue',
      examples: ['queue', 'help queue'],
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
    const tracks = queue.tracks.slice(0, 10).map((m, i) => `${i + 1}. **${m.title}** ([link](${m.url}))`);

    await interaction.followUp({
      embeds: [
        {
          title: 'Server Queue',
          description: `${tracks.join('\n')}${
            queue.tracks.length > tracks.length
              ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track`
                : `${queue.tracks.length - tracks.length} more tracks`}`
              : ''
          }`,
          color: 0xff0000,
          fields: [{
            name: 'Now Playing',
            value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`,
          }],
        },
      ],
    });
  }
}

module.exports = new Queue();
