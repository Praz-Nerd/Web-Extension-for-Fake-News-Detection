from flask import Flask, request, make_response
from flask_cors import CORS
from web_crawler import WebCrawler
import requests

app = Flask(__name__)
CORS(app)

@app.post("/")
def hello_world():
    req = request.get_json(silent=True)
    return {'message': 'hello', "req_type":req['url']}

@app.post('/text')
def extractText():
    req = request.get_json(silent=True)
    dom = requests.get(req['url']).text
    crawler = WebCrawler(dom)
    return {'text':crawler.extractText()}


if __name__ == '__main__':
    app.run(debug=True)