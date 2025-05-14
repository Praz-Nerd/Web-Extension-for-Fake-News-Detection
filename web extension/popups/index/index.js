window.onload = () => {
    let filter = { active: true, currentWindow: true }
    let urlBox = document.getElementById('urlBox')
    let resultBox = document.getElementById('resultBox')
    let textArea = document.getElementById('textArea')

    //automatic function call for getting url, passing to backend, and getting the response
    chrome.tabs.query(filter).then((tabs) => {
        let url = tabs[0].url
        urlBox.value = url
        console.log(url)

        chrome.runtime.sendMessage({ action: 'sendUrl', url: url }, (response) => {
            //remove loading and get results
            document.getElementById('loadingSpinner').style.display = 'none'
            document.getElementById('resultBoxContainer').style.display = 'flex'
            //if response result, update popup with result information
            
            processResult(response)

            console.log(response)
        })
    })

    //button for handling pasted text
    document.getElementById('pasteTextButton').addEventListener('click', () => {
        text = document.getElementById('pasteTextArea').value
        if (text.length == 0) {
            resultBox.value = 'No text pasted...'
        }
        else {
            //send text to backend
            chrome.runtime.sendMessage({ action: 'sendText', text: text }, (response) => {
                processResult(response)
                console.log(response)
            })
        }
    })




    function initTextArea(label, text = '') {
        document.getElementById('textAreaContainer').style.display = 'block'
        document.getElementById('textAreaLabel').innerHTML = label
        textArea.value = text
    }

    function updateBodyColor(value) {
        let bodyStyle = document.body.style
        if (value <= 30) bodyStyle.color = 'green'
        else if (value > 30 && value <= 60) bodyStyle.color = 'orange'
        else bodyStyle.color = 'red'
    }

    function processResult(response) {
        if (response.result) {
            let result = parseFloat(response.result).toFixed(4) * 100
            updateBodyColor(result)

            resultBox.value = result.toString() + '% FAKE'

            if (response.text && response.text.length !== 0) {
                initTextArea('Extracted text:', response.text)
            }
            else {
                document.getElementById('databaseNotification').style.display = 'block'
            }
        }
        else if (response.message === 'Invalid url') {
            document.getElementById('pasteTextContainer').style.display = 'block'
        }
        else {
            resultBox.value = response.message
        }

    }

}
