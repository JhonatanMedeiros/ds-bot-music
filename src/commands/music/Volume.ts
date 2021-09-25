import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Volume extends Command {
  constructor() {
    super({
      name: 'volume',
      category: 'Música',
      description: 'Define o volume da música',
      options: [
        {
          name: 'valor',
          type: 'INTEGER',
          description: 'O volume pode ser definido de (0-100)',
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
      await interaction.followUp({ content: '❌ | Nenhuma música está sendo tocada!' });
      return;
    }

    const vol = (interaction as any).options.get('valor');
    if (!vol) {
      await interaction.followUp({ content: `🎧 | O volume atual é **${queue.volume}**%!` });
      return;
    }
    if ((vol.value) < 0 || (vol.value) > 100) {
      await interaction.followUp({ content: '❌ | O intervalo de volume deve ser 0-100' });
      return;
    }
    const success = queue.setVolume(vol.value);
    await interaction.followUp({
      content: success ? `✅ | Volume definido para **${vol.value}%**!` : '❌ | Algo deu errado!',
    });
  }
}

module.exports = new Volume();
