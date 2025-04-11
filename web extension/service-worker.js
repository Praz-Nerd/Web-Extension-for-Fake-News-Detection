//listener for popup messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        switch (message.action) {
            case "getTime": {
                const currentTime = new Date().toLocaleTimeString();
                sendResponse({ time: currentTime });
                break;
            }

            case "sendUrl": {
                if (message.url) {
                    try {
                        const resultText = await getResponse('http://127.0.0.1:5000/text/url', 'post', {url:message.url})
                        sendResponse(resultText);
                    } catch (error) {
                        console.error("Fetch error:", error);
                        sendResponse({ message: 'error' });
                    }
                } else {
                    sendResponse({ message: 'error' });
                }
                break;
            }

            case "sendText": {
                if (message.text) {
                    try {
                        const resultText = await getResponse('http://127.0.0.1:5000/text', 'post', {text:message.text})
                        sendResponse(resultText);
                    } catch (error) {
                        console.error("Fetch error:", error);
                        sendResponse({ message: 'error' });
                    }
                } else {
                    sendResponse({ message: 'error' });
                }
                break;
            }

            default:
                sendResponse({ message: 'Invalid action' });
        }
    })();

    return true; // Keeps the message channel open for async sendResponse
});

async function getResponse(url, method, body) {
    params = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        //body: JSON.stringify({ url: message.url })
    }

    if(method.toLowerCase() === 'post')
        params.body = JSON.stringify(body)

    const response = await fetch(url, params);
    const resultText = await response.text();
    return resultText
}
