// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTime") {
        const currentTime = new Date().toLocaleTimeString();
        sendResponse({ time: currentTime });
    }
    if(message.action === "sendUrl"){
        if (message.url){
            //do the fetch to backend
            //retreive response
            fetch('http://127.0.0.1:5000', {
                method: 'POST',
                body: JSON.stringify({url:message.url}),
                headers:{
                    "Content-Type":'application/json'
                }
            }).then(async (response)=>{
                sendResponse(await response.text())
            })
        }
        else{
            sendResponse({message:'error'})
        }
    }
    return true; // Required for async sendResponse
});