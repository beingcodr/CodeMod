# Moderation configuration

Currently the Moderation keywords are added manually to `json/data.json` file.

Moderation checker scans every message on the server to check if the message contains any slang words. If yes the bot alerts the admins of the group by mentioning the **ADMIN** privileaged role.

You need to setup which role you want to be mentioned when someone uses slang words on the server.

## Setting up the @role to be mentioned

1. In order to get the **id** of a role that you want to be mentioned
1. On any channel of the server, type `\@<role-name>` and send the message
1. Discord will reply with the id of that role.It'll look something like **<@&713426332528148541>**. Copy the **id**
1. In the `json/config.json` update the **adminRole** with the id as

    ```json
    {
        "adminRole": "713426332528148541"
    }
    ```




You can also turn off moderation by changing the value of `moderation` in the `json/config.json` to **false**

## Steps

1. Open `json/data.json` file.
1. You can see 2 arrays named **faqs** and **moderate** [Do not modify the FAQ array]
1. You can either add moderation keywords to the array keeping the other values **OR** delete all the moderation keywords and add new ones in the **moderate** array.
1. In order to add new moderation keywords you need to add _Strings_ to the array

    ```json
    ["keyword1", "keyword2", ..., "keywordn"]
    ```

**Want to learn more about [`faqs`](https://github.com/rahul1116/CodeMod/blob/master/docs/faqconfig.md) array?**
