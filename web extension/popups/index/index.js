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
            let bodyStyle = document.body.style
            //remove loading and get results
            document.getElementById('loadingSpinner').style.display = 'none'
            document.getElementById('resultsContainer').style.display = 'block'
            //if response result, update popup with result information
            if(response.result){
                let result = parseFloat(response.result).toFixed(4)*100
                if(result <= 30) bodyStyle.color = 'green'
                else if(result > 30 && result <= 60) bodyStyle.color = 'yellow'
                else bodyStyle.color = 'red'

                resultBox.value = result.toString() + '% FAKE'
                textArea.value = response.text
            }
            else{
                resultBox.value = response.message
            }
            console.log(response)
        })
    })

}
