from flask import Flask, request, make_response
from flask_cors import CORS
from utils.web_crawler import WebCrawler
from utils.preprocessing import *
import requests

app = Flask(__name__)
CORS(app)

@app.post("/")
def hello_world():
    req = request.get_json(silent=True)
    return {'message': 'hello', "req_type":req['url']}

@app.post('/text/url')
def extractTextFromUrl():
    '''get a dom and get the text from it, then preprocess'''
    req = request.get_json(silent=True)
    dom = requests.get(req['url']).text
    crawler = WebCrawler(dom)
    text = preprocess_text(crawler.extractText())
    return {'text':text}

@app.post('/text')
def extractText():
    '''preprocess text that is already received'''
    req = request.get_json(silent=True)
    text = preprocess_text(req['text'])
    return {'text':text}
    


if __name__ == '__main__':
    app.run(debug=True)