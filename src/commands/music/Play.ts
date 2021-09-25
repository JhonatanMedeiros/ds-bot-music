import { QueryType } from 'discord-player';
import { Guild, GuildMember } from 'discord.js';
import type Context from '../../utils/Context';
import Command from '../../utils/Command';
import { PlayerMetadata } from '../../models/PlayerMetadata';

class Play extends Command {
  constructor() {
    super({
      name: 'play',
      category: 'Música',
      description: 'Toque uma música do YouTube ou do Spotify',
      options: [
        {
          name: 'query',
          type: 'STRING',
          description: 'A música que voce quer tocar',
          required: true,
        },
      ],
      examples: ['play', 'help play'],
    });
  }

  async run(ctx: Context) {
    const { interaction, client } = ctx;
    const { player } = client.playerManager;

    await interaction.deferReply();

    const query = interaction?.options.get('query')?.value as string;
    const searchResult = await player
      .search(query, {
        requestedBy: interaction.user,
        searchEngine: interaction.commandName === 'soundcloud' ? QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO,
      })
      .catch(() => {
      });

    if (!searchResult || !searchResult.tracks.length) {
      await interaction.followUp({ content: 'Nenhum resultado foi encontrado!' });
      return;
    }

    const queue = await player.createQueue<PlayerMetadata>((interaction.guild as Guild), {
      metadata: interaction.channel,
    });

    try {
      if (!queue.connection) {
        await queue.connect((interaction?.member as GuildMember).voice?.channel as any);
      }
    } catch {
      player.deleteQueue<PlayerMetadata>((interaction?.guildId as any));
      await interaction.followUp({ content: 'Não foi possível entrar no seu canal de voz!' });
      return;
    }

    await interaction.followUp({
      content: `⏱ | Carregando sua ${searchResult.playlist ? 'playlist' : 'música'}...`,
    });

    if (searchResult.playlist) {
      queue.addTracks(searchResult.tracks);
    } else {
      queue.addTrack(searchResult.tracks[0]);
    }

    if (!queue.playing) {
      await queue.play();
    }
  }
}

module.exports = new Play();
