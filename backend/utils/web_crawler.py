from bs4 import BeautifulSoup

class WebCrawler:
    def __init__(self, htmlString):
        self.htmlString = htmlString
        self.soup = BeautifulSoup(htmlString, 'html.parser')
    
    def extractText(self):
        text = ''
        for paragraph in self.soup.find_all('p'):
            text = ' '.join([text, paragraph.get_text()])
        return text.strip()

