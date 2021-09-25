import { resolve } from 'path';
import { access, readdir, stat } from 'fs/promises';
import { Collection } from 'discord.js';
import type DiscordEvent from './DiscordEvent';

import type Client from '../../main';

class EventsManager {
  private readonly _client: typeof Client;

  private readonly _events: Collection<string, DiscordEvent>;

  private readonly _path: string;

  constructor(client: typeof Client) {
    this._client = client;
    this._events = new Collection();
    this._path = resolve(__dirname, '..', 'events');
  }

  get events(): Collection<string, DiscordEvent> {
    return this._events;
  }

  addEvent(event: DiscordEvent) {
    this._events.set(event.name.toLowerCase(), event);
    this._client.on(event.name, event.run.bind(event));
    const path = resolve(this._path, `${event.fileName}.js`);
    delete require.cache[require.resolve(path)];
  }

  async loadEvent() {
    try {
      await access(this._path);
    } catch (error) {
      return;
    }

    const events = await readdir(this._path);

    if (events && events.length > 0) {
      // eslint-disable-next-line
      for (const event of events) {
        const path = resolve(this._path, event);
        // eslint-disable-next-line
        const stats = await stat(path);

        if (event !== 'Event.js' && stats.isFile() && event.endsWith('.js')) {
          // eslint-disable-next-line
          this.addEvent(new (require(path))(this._client));
        }
      }
    }
  }
}

export default EventsManager;
