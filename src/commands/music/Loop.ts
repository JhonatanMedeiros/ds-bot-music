import { QueueRepeatMode } from 'discord-player';
import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Loop extends Command {
  constructor() {
    super({
      name: 'loop',
      category: 'music',
      description: 'Sets loop mode',
      options: [
        {
          name: 'mode',
          type: 'INTEGER',
          description: 'Loop type',
          required: true,
          choices: [
            {
              name: 'Off',
              value: QueueRepeatMode.OFF,
            },
            {
              name: 'Track',
              value: QueueRepeatMode.TRACK,
            },
            {
              name: 'Queue',
              value: QueueRepeatMode.QUEUE,
            },
            {
              name: 'Autoplay',
              value: QueueRepeatMode.AUTOPLAY,
            },
          ],
        },
      ],
      examples: ['loop', 'help loop'],
    });
  }

  async run(ctx: Context) {
    const { interaction, client } = ctx;
    const { player } = client.playerManager;
    await interaction.deferReply();
    const queue = player.getQueue<PlayerMetadata>(interaction?.guildId as any);

    if (!queue || !queue.playing) {
      await interaction.followUp({ content: '❌ | No music is being played!' });
    }
    const loopMode = (interaction as any).options.get('mode').value;
    const success = queue.setRepeatMode(loopMode);
    const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
    await interaction.followUp({
      content: success ? `${mode} | Updated loop mode!` : '❌ | Could not update loop mode!',
    });
  }
}

module.exports = new Loop();
