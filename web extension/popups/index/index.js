window.onload = ()=>{
    document.getElementById('btnStart').addEventListener('click', getTabHTML({ active: true, currentWindow: true }))
}

function getTabHTML(filter){
    chrome.tabs.query(filter).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: DOMtoString,
            args: ['body']  
        });

    }).then(function (results) {
        console.log(results[0].result) 
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