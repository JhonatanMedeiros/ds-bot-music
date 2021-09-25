import { Player } from 'discord-player';
import Client from '../../main';

class PlayerManager {
  private readonly client: typeof Client;

  readonly player: Player;

  constructor(client: typeof Client) {
    this.client = client;
    this.player = new Player(this.client, {
      ytdlOptions: {
        // eslint-disable-next-line no-bitwise
        highWaterMark: 1 << 25,
        // headers: {
        //     cookie: process.env.YT_COOKIE
        // }
      },
    });

    this.loadPlayer();
  }

  loadPlayer() {
    this.player.on('error', (queue, error) => {
      console.debug(error.name);
      console.debug(error.stack);
      this.client.logger.error(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });

    this.player.on('connectionError', (queue, error) => {
      this.client.logger.error(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    this.player.on('trackStart', (queue, track) => {
      (queue.metadata as any).send(
        `🎶 | Começou a tocar: **${track.title}** no canal **${queue.connection.channel.name}**!`,
      );
    });

    this.player.on('trackAdd', (queue, track) => {
      (queue.metadata as any).send(`🎶 | Música **${track.title}** adiciada a fila!`);
    });

    this.player.on('botDisconnect', (queue) => {
      (queue.metadata as any).send('❌ | Fui desconectado manualmente do canal de voz, limpando a fila!');
    });

    this.player.on('channelEmpty', (queue) => {
      (queue.metadata as any).send('❌ | Ninguém está no canal de voz, saindo ...');
    });

    this.player.on('queueEnd', (queue) => {
      (queue.metadata as any).send('✅ | Fila terminada!');
    });
  }
}

export default PlayerManager;
