# FAQ configuration

Currently the FAQs are added manually to `json/data.json` file.

## Steps

1. Open `json/data.json` file.
1. You can see 2 arrays named **faqs** and **moderate** [Do not modify the moderate array]
1. You can either add FAQs to the array keeping the other FAQs **OR** delete all the FAQs and add new ones in the **faqs** array.
1. In order to add new FAQs you need to add json objects in the following manner

    ```json
    {
        "name": "<FAQ question goes here>",
        "value": "<FAQ answer goes here>",
        "inline": false
    },
    ```

    The key in json file needs to be **name** and **value**. This is used by Discord's [`MessageEmbed.addField()`](https://discord.js.org/#/docs/main/stable/class/MessageEmbed?scrollTo=addField) to render the data to the member asking for the FAQ.

    **Note:** The max chars for `name` is 256 chars and for `value` is 1024 chars. If the FAQ answer exceeds the limit, we recommend to divide the FAQ into two parts.

    **Alternatives in this case would be to**

    1. Record a podcast around that topic and post the link
    2. Make a video and post the link

**Want to learn more about [`moderate`](https://github.com/rahul1116/CodeMod/blob/master/docs/moderationconfig.md) array?**
