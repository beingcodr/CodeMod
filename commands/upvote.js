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

    args = args.slice(1);

    let {
      codeDoubt,
      codeError,
      verbalDoubt,
      sharedResource,
      contribution,
      slangUsed,
    } = member.points;

    if (args.length <= 1) {
      switch (args[0]) {
        case "codeError":
          codeError += 15;
          break;
        case "contribution":
          contribution += 10;
          break;
        case "verbalDoubt":
          verbalDoubt += 10;
          break;
        case "codeDoubt":
          codeDoubt += 10;
          break;
        case "sharedResource":
          sharedResource += 5;
      }
    } else {
      message.delete();
      messageErrorAsync(
        message,
        `<@!${message.author.id}>, please upvote for only one type of help at a time`
      );
      return;
    }

    member.totalPoints =
      codeDoubt + codeError + verbalDoubt + sharedResource + contribution;
    member.points = {
      codeDoubt,
      codeError,
      verbalDoubt,
      sharedResource,
      contribution,
      slangUsed,
    };

    message.delete();
    try {
      await member.save();
    } catch (error) {
      console.log(error);
    }
  },
};
