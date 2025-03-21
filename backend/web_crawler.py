from bs4 import BeautifulSoup

class WebCrawler:
    def __init__(self, htmlString):
        self.htmlString = htmlString
        self.soup = BeautifulSoup(htmlString, 'html.parser')
    
    def extractText(self):
        return self.soup.get_text()

