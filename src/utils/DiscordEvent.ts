import type Client from '../../main';

abstract class DiscordEvent {
  client: typeof Client;

  name: string;

  fileName: string;

  protected constructor(client: typeof Client, name: string, fileName: string) {
    if (this.constructor === DiscordEvent) throw new Error('Event class is an abstract class');
    this.client = client;
    this.name = name;
    this.fileName = fileName;
  }

  abstract run(...args: any[]) : void;
}

export default DiscordEvent;
