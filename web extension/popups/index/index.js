window.onload = ()=>{
    let filter = { active: true, currentWindow: true }
    chrome.runtime.sendMessage({ action: "getTime" }, (response) => {
        if (response) {
            console.log('Extension started ' + String(response.time));
        }
    });



    document.getElementById('btnStart').addEventListener('click', ()=>getTabUrl(filter))

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
    
}
