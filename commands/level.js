// const { MessageEmbed } = require('discord.js');
// const { colors } = require('../json/config.json');

// const fs = require('fs');

// STEP 1: Reading JSON file
// const members = require('../json/members.json');

// module.exports = {
//     name: 'level',
//     description: 'dslkfjlkdjfl',
//     args: true,
//     usage: '@user keyword',
//     guildOnly: true,
//     execute: async (message, args) => {
//         let user = message.mentions.users.first();
//         if (!user) {
//             message.reply('No @user is tagged!');
//         }

//         if (args.length) {
//             console.log(args);
// Defining new user
//             let newMember = {
// id: `#${member.user.discriminator}`,
// username: `${member.user.username}`,
// nickName: null,
// server: `${member.guild.name}`,
//                 level: 0,
//                 totalPoints: 0,
//             };

// STEP 2: Adding new data to users object
//             members.push(newMember);

// Writing data to the file
//             try {
//                 fs.writeFileSync('./json/members.json', JSON.stringify(members));
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     },
// };
