const { MessageEmbed } = require('discord.js');
const { colors } = require('../json/config.json');
const { faqs } = require('../json/data.json');
const { messageErrorAsync } = require('../helpers/message');

module.exports = {
    name: 'faq',
    description:
        'This command shows the Frequently Asked Question specified by you.\n> **Tip:** use specific keywords such as `coding, blogs, etc`',
    args: true,
    usage: 'your question',
    execute: async (message, args) => {
        // The array which stores the results as per the question passed
        let faqArray = [];
        // todo: Make a duplicate checker function that takes 2 FAQ's in this case and checks if the question or answer has similarityCount > 5
        // Todo: If yes then it is called for review
        // let similarityCount = 0;

        // Iterate through the FAQ data
        faqs.forEach((faq) => {
            // Iterates through the args array and checks if the element is present in the faq.name
            for (let i = 0; i < args.length; i++) {
                // If the element is present in the faq.name it goes in further
                if (faq.name.toLowerCase().includes(args[i])) {
                    // This condition checks if the faq object is already present in faqArray or not
                    if (!faqArray.includes(faq)) {
                        // If faq is not present in faqArray then it pushes the FAQ
                        faqArray.push(faq);
                    }
                }
            }
        });

        if (faqArray.length === 0) {
            message
                .delete()
                .catch(() =>
                    console.log(
                        '[Warning]: DM to the bot cannot be deleted with `message.delete()` '
                    )
                );
            messageErrorAsync(
                message,
                "No FAQ's matched your question. Try `/faq your question`\n> **Tip:** use specific keywords such as `coding, blogs, etc`",
                `<@!${message.author.id}>, No FAQ's matched your question. Try \`/faq your question\`\n> **Tip:** use specific keywords such as \`coding, blogs, etc\``
            );
            return;
        }
        let faqEmbed;

        if (
            !messageErrorAsync(
                message,
                `**${faqArray.length} results found**`,
                `<@!${message.author.id}>, I can't send you the results`
            )
        )
            return;

        faqArray.forEach((faq) => {
            faqEmbed = new MessageEmbed()
                .setColor(colors.green)
                .setTitle('FAQ')
                .setThumbnail(
                    'https://instagram.fbom15-1.fna.fbcdn.net/v/t51.2885-19/s320x320/90181421_510156213222489_6690442420095549440_n.jpg?_nc_ht=instagram.fbom15-1.fna.fbcdn.net&_nc_ohc=QI8cRp3F8jEAX8v63zw&oh=3049ecd08c681c1cd52cff42ed0b4a26&oe=5EF5EA33'
                )
                .addField(`${faq.name}`, `${faq.value}`);

            message.author.send(faqEmbed);
        });

        if (faqArray.length > 5) {
            messageErrorAsync(
                message,
                "If you're bombarded with too many **FAQ** results. Try to be more specific with the questions\n\n> Tip: use specific keywords such as `coding, blogs, etc` and avoid generic words such as **how, where, what**",
                `<@!${message.author.id}> If you're bombarded with too many **FAQ** results. Try to be more specific with the questions\n\n> Tip: use specific keywords such as \`coding, blogs, etc\` and avoid generic words such as **how, where, what**`
            );
        }

        message
            .delete()
            .catch(() =>
                console.log('[Warning]: DM to the bot cannot be deleted with `message.delete()` ')
            );
    },
};
