const { prefix, botChannel } = require('../json/config.json');
const { messageErrorAsync, deleteMessage } = require('../helpers/message');

module.exports = {
    name: 'help',
    description: 'This command shows you all the commands you can use',
    guildOnly: true,
    usage: '<commandName>',
    aliases: ['commands'],
    execute: async (message, args) => {
        deleteMessage(message, 0);
        let data = [];
        const { commands } = message.client;
        let isAdmin = false;

        if (message.member.hasPermission(['ADMINISTRATOR'])) isAdmin = true;
        if (!args.length) {
            data.push("Here's a list of all the available commands  ");
            data.push(
                isAdmin
                    ? commands
                          .map((command) => {
                              return `\`${command.name}\``;
                          })
                          .join(', ')
                    : commands
                          .filter((command) => !command.adminOnly)
                          .map((cmnd) => {
                              return `\`${cmnd.name}\``;
                          })
                          .join(', ')
            );
            data.push(
                `\n\nYou can send \`${prefix}help <commandName>\` to get info on a specific command!`
            );

            !isAdmin
                ? messageErrorAsync(message, data, `<@!${message.author.id}>,\n${data}, `)
                : messageErrorAsync(
                      message,
                      data,
                      `<@!${message.author.id}>, with great roles comes great responsibilities :man_superhero:`
                  );
            return;
        } else if (args.length > 1) {
            return messageErrorAsync(
                message,
                `Pass one command name at a time to get more details`,
                `<@!${message.author.id}>, pass one command name at a time to get more details`
            );
        }

        let commandName = args[0];
        let command =
            commands.get(commandName) ||
            commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return messageErrorAsync(
                message,
                'Invalid command',
                `<@!${message.author.id}>, Invalid command`
            );
        }

        data.push(`\n**Command Name:** ${command.name}`);
        if (command.aliases)
            data.push(
                `\n**Aliases:** ${command.aliases
                    .map((cmd) => {
                        return `\`${cmd}\``;
                    })
                    .join(', ')}`
            );
        if (command.description) data.push(`\n**Description:** ${command.description}`);
        if (command.usage) data.push(`\n**Usage:** ${prefix}${command.name} ${command.usage}`);
        if (command.guildOnly) data.push(`\n**Server only command:** ${command.guildOnly}`);

        if (isAdmin) {
            if (command.adminOnly) {
                messageErrorAsync(
                    message,
                    data.join(''),
                    `<@!${message.author.id}>, with great roles comes great responsibilities :man_superhero:`
                );
            } else {
                messageErrorAsync(
                    message,
                    data.join(''),
                    `<@!${message.author.id}>, \n${data.join('')}`
                );
            }
        } else {
            if (command.adminOnly) {
                messageErrorAsync(
                    message,
                    'Invalid command for a member',
                    `<@!${message.author.id}>, Invalid command for a member`
                );
            } else {
                messageErrorAsync(
                    message,
                    data.join(''),
                    `<@!${message.author.id}>, \n${data.join('')}`
                );
            }
        }
    },
};
