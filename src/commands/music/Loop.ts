import { QueueRepeatMode } from 'discord-player';
import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Loop extends Command {
  constructor() {
    super({
      name: 'loop',
      category: 'Música',
      description: 'Define o modo de loop',
      options: [
        {
          name: 'modo',
          type: 'INTEGER',
          description: 'Modo de loop',
          required: true,
          choices: [
            {
              name: 'Desligado',
              value: QueueRepeatMode.OFF,
            },
            {
              name: 'Musica',
              value: QueueRepeatMode.TRACK,
            },
            {
              name: 'Fila',
              value: QueueRepeatMode.QUEUE,
            },
            {
              name: 'Reprodução automática',
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
      await interaction.followUp({ content: '❌ | Nenhuma música está sendo tocada!' });
    }
    const loopMode = (interaction as any).options.get('modo').value;
    const success = queue.setRepeatMode(loopMode);
    const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
    await interaction.followUp({
      content: success ? `${mode} | Modo de loop atualizado!` : '❌ | Não foi possível atualizar o modo de loop!',
    });
  }
}

module.exports = new Loop();
