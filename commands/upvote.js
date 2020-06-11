const Member = require("../server/models/Member");
const { botChannel } = require("../json/config.json");

module.exports = {
  name: "upvote",
  desciption: "This command lets the user upvote other users for their help",
  guildOnly: true,
  args: true,
  usage: "@username <keyword>",
  execute: async (message, args) => {
    mentionedMember = message.mentions.users.first();
    if (!mentionedMember) return;

    const member = await Member.findOne({
      discordId: message.mentions.users.first().id,
    });
    if (!member) {
      try {
        await message.author.send(
          `<@!${mentionedMember.id}> is not registered in the database`
        );
      } catch (error) {
        message.client.channels
          .fetch(process.env.CM_BOT_CHANNEL || botChannel)
          .then((channel) => {
            channel.send(
              `<@!${message.author.id}>, the user you mentioned is not registered in the DB. Your DM is not accessible. Please enable it **User settings > Privacy & safety > Allow messages from server members**`
            );
          });
      }
    }

    let pointInc = member[points],
      totalPointsCal = member[totalPoints];

    const { codeDoubt, codeError, verbalDoubt, sharedResource } = pointInc;

    pointInc.contribution += 1;
    totalPointsCal += codeDoubt + codeError + verbalDoubt + sharedResource;

    if (!args.length > 1) {
      if (args === "codeError") {
        codeError += 15;
      }
      if (args === "verbalDoubt") {
        verbalDoubt += 5;
      }
      if (args === "codeDoubt") {
        codeDoubt += 10;
      }
      if (args === "sharedResource") {
        sharedResource += 5;
      }
    } else {
      try {
        await message.author.send(
          "Please upvote for only one type of help at a time."
        );
      } catch (error) {
        console.log(error);
      }
    }

    Member.update(
      {
        discordId: message.mentions.users.first().id,
      },
      { $set: { points: pointInc, totalPoints: totalPointsCal } }
    );
  },
};
