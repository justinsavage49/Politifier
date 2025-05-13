import { badWords, swapWord } from "./bad-words.js"

function rot13(message)
{
    const alpha = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';

    return message.replace(/[a-z]/gi, (letter) => {
        return alpha[alpha.indexOf(letter) + 13];
    });
}

function swapWords()
{
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let currentNode;
    while (currentNode = textNodes.nextNode())
    {
        for (const badWord in badWords)
        {
            const regex = new RegExp(`\\b${rot13(badWord)}\\b`, "gi");
            if(regex.test(currentNode.nodeValue))
            {
                if(DEVELOPER_MODE)
                {
                    console.log(`FOUND: ${rot13(badWord)}`);
                }

                currentNode.nodeValue = currentNode.nodeValue.replace(regex, swapWord(rot13(badWords[badWord])));
            }
        }
    }
}

function swapInjector()
{
    // Don't run scripts on .gov sites
    const regex = /\.gov\b/gu;
    const validUrl = !(regex.test(window.location.href));
    if(validUrl)
    {
        swapWords();
    }
}

swapInjector();