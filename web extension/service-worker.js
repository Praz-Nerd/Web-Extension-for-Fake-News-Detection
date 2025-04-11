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
                        const response = await fetch('http://127.0.0.1:5000/text/url', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ url: message.url })
                        });

                        const resultText = await response.text();
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
                // Placeholder for future logic
                sendResponse({ message: 'Not implemented yet' });
                break;
            }

            default:
                sendResponse({ message: 'Invalid action' });
        }
    })();

    return true; // Keeps the message channel open for async sendResponse
});
