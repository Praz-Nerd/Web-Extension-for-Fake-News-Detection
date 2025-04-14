from flask import Flask, request, make_response, g, Response
from flask_cors import CORS
from utils.web_crawler import WebCrawler
from utils.preprocessing import *
from utils.text_classifier import models
import requests, json, time

app = Flask(__name__)
CORS(app)

@app.before_request
def beforeRequest():
    '''define variables that are used in all requests'''
    g.modelName = request.args.get('model', default='lgbm')
    g.req = request.get_json(silent=True)
    g.start = time.time()


@app.post("/")
def hello_world():
    user = request.args.get('user', default='generic user')
    req = request.get_json(silent=True)
    return {'message': 'hello, ' + user, "req_type":req}

@app.post('/text/url')
def extractTextFromUrl():
    '''get a dom and get the text from it, then preprocess'''
    dom = requests.get(g.req['url']).text
    crawler = WebCrawler(dom)
    text = preprocess_text(crawler.extractText())
    result = models[g.modelName].predict(text)
    
    return {'text':text, 'result':result}

@app.post('/text')
def extractText():
    '''preprocess text that is already received'''
    text = preprocess_text(g.req['text'])
    result = models[g.modelName].predict(text)
    return {'text':text, 'result':result}

@app.after_request
def afterRequest(response: Response):
    '''finalize the response and send to client'''
    if response.content_type == "application/json":
        data = json.loads(response.get_data(as_text=True))
        data['model'] = g.modelName
        data["elapsedTime"] = time.time() - g.start
        response.set_data(json.dumps(data))

    return response
    


if __name__ == '__main__':
    app.run(debug=True)