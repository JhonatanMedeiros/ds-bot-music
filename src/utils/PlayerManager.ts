import { Player } from 'discord-player';
import Client from '../../main';

class PlayerManager {
  private readonly client: typeof Client;

  readonly player: Player;

  constructor(client: typeof Client) {
    this.client = client;
    this.player = new Player(this.client, {
      ytdlOptions: {
        // headers: {
        //     cookie: process.env.YT_COOKIE
        // }
      },
    });

    this.loadPlayer();
  }

  loadPlayer() {
    this.player.on('error', (queue, error) => {
      this.client.logger.error(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });

    this.player.on('connectionError', (queue, error) => {
      this.client.logger.error(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    this.player.on('trackStart', (queue, track) => {
      (queue.metadata as any).send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
    });

    this.player.on('trackAdd', (queue, track) => {
      (queue.metadata as any).send(`🎶 | Track **${track.title}** queued!`);
    });

    this.player.on('botDisconnect', (queue) => {
      (queue.metadata as any).send('❌ | I was manually disconnected from the voice channel, clearing queue!');
    });

    this.player.on('channelEmpty', (queue) => {
      (queue.metadata as any).send('❌ | Nobody is in the voice channel, leaving...');
    });

    this.player.on('queueEnd', (queue) => {
      (queue.metadata as any).send('✅ | Queue finished!');
    });
  }
}

export default PlayerManager;
