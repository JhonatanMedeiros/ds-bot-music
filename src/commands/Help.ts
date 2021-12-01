import type Context from '../utils/Context';
import Command from '../utils/Command';

class Help extends Command {
  constructor() {
    super({
      name: 'help',
      category: 'Utilidades',
      description: 'Mostra todos os comandos do bot',
      disabled: false,
      options: [{
        type: 'STRING',
        name: 'comando',
        description: 'Obtenha a ajuda deste comando',
        required: false,
      }],
      examples: ['help', 'help botinfo', 'help play'],
    });
  }

  async run(ctx: Context) {
    if (ctx.args.getString('comando')) {
      const command: Command | undefined = ctx?.client?.commands?.findCommand(
        ctx?.args?.getString('comando')?.toLowerCase() as string,
      );
      if (!command) {
        await ctx.reply(`O comando \`${ctx.args.getString('comando')}\` não existe.`);
        return;
      }

      await ctx.reply({
        embeds: [{
          title: 'Help',
          description: command.description,
          fields: [
            {
              name: 'Options',
              value: command.options.length > 0
                ? command.options.map((x: any) => `\`${x.required
                  ? '(' : '<'}${x.name}:${x.type.toString().toLowerCase()}${x.required ? ')' : '>'}\``).join('\n')
                : 'No options',
              inline: true,
            },
            {
              name: 'Examples',
              value: command.examples.length > 0
                ? command.examples.map((x) => `\`${x}\``).join('\n')
                : 'No examples',
              inline: true,
            },
          ],
        }],
      });
      return;
    }

    const category: string[] = [];

    ctx.client.commands.commands.each((command: Command) => {
      if (!category.includes(command.category) && !command.disabled) {
        category.push(command.category);
      }
    });

    await ctx.reply({
      embeds: [{
        title: 'Ajuda',
        thumbnail: {
          url: ctx?.client?.user?.displayAvatarURL({
            size: 512,
            format: 'png',
          }),
        },
        // eslint-disable-next-line
        description: 'Aqui está a lista de comandos.\nExemplo:\n`/<comando> Executar um comando.`\n`/help <comando> Ajuda do comando.`\n',
        fields: category.map((x) => ({
          name: x,
          value: ctx.client.commands.commands.filter(
            (cmd: Command) => cmd.category === x && !cmd.testCmd,
          ).map((cmd: Command) => `\`${cmd.name}\``).join(', '),
        })),
        timestamp: new Date(),
        footer: {
          text: ctx?.client?.user?.username,
          iconURL: ctx?.client?.user?.avatarURL() as string,
        },
      }],
    });
  }
}

module.exports = new Help();
