window.onload = () => {
    let filter = { active: true, currentWindow: true }
    let urlBox = document.getElementById('urlBox')
    let resultBox = document.getElementById('resultBox')
    let textArea = document.getElementById('textArea')
    let notification = document.getElementById('notification')


    //automatic function call for getting url, passing to backend, and getting the response
    chrome.tabs.query(filter).then((tabs) => {
        let url = tabs[0].url
        urlBox.value = url

        chrome.runtime.sendMessage({ action: 'sendUrl', url: url }, (response) => {
            //remove loading and get results
            document.getElementById('loadingSpinner').style.display = 'none'
            document.getElementById('resultBoxContainer').style.display = 'flex'
            //if response result, update popup with result information

            processResult(response)
        })
    })

    //button for handling pasted text
    document.getElementById('pasteTextButton').addEventListener('click', () => {
        text = document.getElementById('pasteTextArea').value
        if (text.length <= 200) {
            resultBox.value = 'No text pasted...'
        }
        else {
            //hide button
            document.getElementById('pasteTextButton').style.display = 'none'
            //send text to backend
            document.getElementById('loadingSpinner').style.display = 'block'
            document.getElementById('pasteTextContainer').style.display = 'none'

            chrome.runtime.sendMessage({ action: 'sendText', text: text }, (response) => {
                document.getElementById('loadingSpinner').style.display = 'none'
                document.getElementById('pasteTextContainer').style.display = 'block'

                processResult(response)
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

    function updateHeader(string) {
        document.getElementById('title').innerHTML = string
    }

    function updateResultBox(result) {
        if (result <= 30) {
            updateHeader('True News Detected')
            resultBox.value = (100 - result).toFixed(2).toString() + '% true'
        }
        else {
            updateHeader('Fake News Detected')
            resultBox.value = result.toFixed(2).toString() + '% fake'
        }
    }

    function addNotification(string){
        newNode = notification.cloneNode()
        newNode.innerHTML = string
        notification.insertAdjacentElement('afterend', newNode)
    }

    function processResult(response) {
        if (response.result) {
            let result = parseFloat(response.result)* 100
            updateBodyColor(result)
            updateResultBox(result)

            notification.style.display = 'block'
            notification.innerHTML = 'Model: ' + response.model
            if (response.text && response.text.length !== 0) {
                initTextArea('Extracted text:', response.text)
                elapsedTime = response.elapsedTime.toString().substring(0, 4)
                addNotification('Elapsed time: ' + elapsedTime + ' seconds')
            }
            else {
                //addNotification('Result retreived from database')
                addNotification('Database entry from ' + response.date)
            }
        }
        else if (response.message === 'Invalid url' || response.message === 'No text extracted') {
            resultBox.value = response.message.toString() + ', paste text instead'
            document.getElementById('pasteTextContainer').style.display = 'block'
        }
        else {
            resultBox.value = response.message
        }

    }

}
