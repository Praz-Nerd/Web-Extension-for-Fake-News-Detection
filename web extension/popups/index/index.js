window.onload = ()=>{
    let filter = { active: true, currentWindow: true }
    getTabUrl(filter)
    chrome.runtime.sendMessage({ action: "getTime" }, (response) => {
        if (response) {
            console.log(response.time);
        }
    });
    //document.getElementById('btnStart').addEventListener('click', getTabHTML(filter, ['body']))
    // let tabHtmlString = getTabHTML({ active: true, currentWindow: true }, ['body'])
    // console.log(tabHtmlString)
}

function getTabUrl(filter){
    chrome.tabs.query(filter).then((tabs)=>{
        let url = tabs[0].url
        console.log(url)
        chrome.runtime.sendMessage({action: 'sendUrl', url:url}, (response) =>{
            if(response){
                console.log(response)
            }
        })
    })
}

function getTabHTML(filter, tags){
    let tabHtml = null
    chrome.tabs.query(filter).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        console.log('injecting script...')
        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: DOMtoString,
            args: tags
        });

    }).then(function (results) {
        tabHtml = results[0].result
        console.log(tabHtml)
    }).catch(function (error) {
        console.log('There was an error injecting script : \n' + error.message);
    });
}

function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
}