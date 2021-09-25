declare global {
  interface Console {
    success(...args: any): void;
  }
}

type LoggerTypes =
  | 'log'
  | 'info'
  | 'success'
  | 'debug'
  | 'warn'
  | 'error';

class Logger {
  loggerTitle: string;

  private _types: { [P in LoggerTypes]: string };

  private _originalConsole: Console;

  constructor(title: string) {
    this.loggerTitle = title;
    this._types = {
      log: '\x1b[37m',
      info: '\x1b[34m',
      success: '\x1b[32m',
      debug: '\x1b[35m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    };
    this._originalConsole = { ...console };
    this._init();
  }

  private _init() {
    // eslint-disable-next-line
    for (const [type, color] of Object.entries(this._types) as [LoggerTypes, string][]) {
      this[type] = (...content: any): void => {
        this._originalConsole.log('\x1b[40m', this._getDate(), color, `[${this.loggerTitle}]`, ...content, '\x1b[0m');
      };
      console[type] = (...content: any): void => {
        this[type](...content);
      };
    }
  }

  // eslint-disable-next-line
  log(...content: any[]): void {}

  // eslint-disable-next-line
  info(...content: any[]): void {}

  // eslint-disable-next-line
  success(...content: any[]): void {}

  // eslint-disable-next-line
  debug(...content: any[]): void {}

  // eslint-disable-next-line
  warn(...content: any[]): void {}

  // eslint-disable-next-line
  error(...content: any[]): void {}

  // eslint-disable-next-line
  private _getDate() {
    return `[${new Date(Date.now()).toLocaleString('pt-BR')}]`;
  }
}

export default Logger;
