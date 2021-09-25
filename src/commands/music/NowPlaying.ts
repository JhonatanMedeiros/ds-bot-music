import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class NowPlaying extends Command {
  constructor() {
    super({
      name: 'np',
      category: 'Música',
      description: 'Reproduzindo agora',
      examples: ['np', 'help np'],
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
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    await interaction.followUp({
      embeds: [
        {
          title: 'Reproduzindo agora',
          description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
          fields: [
            {
              name: '\u200b',
              value: progress,
            },
          ],
          color: 0xffffff,
        },
      ],
    });
  }
}

module.exports = new NowPlaying();
