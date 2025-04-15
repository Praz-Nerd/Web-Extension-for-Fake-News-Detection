window.onload = () => {
    let filter = { active: true, currentWindow: true }
    let textArea = document.getElementById('textArea')
    
    document.getElementById('btnCurrentTab').addEventListener('click', () => {
        chrome.tabs.query(filter).then((tabs) => {
            let url = tabs[0].url
            console.log(url)
            chrome.runtime.sendMessage({ action: 'sendUrl', url: url }, (response) => {
                if (response) {
                    console.log(response)
                }
            })
        })
    })

    document.getElementById('btnPastedText').addEventListener('click', ()=>{
        let text = textArea.value
        if(text.length > 0){
            console.log(text)
        }
        else{
            alert('text no good')
        }
        
    })


}
