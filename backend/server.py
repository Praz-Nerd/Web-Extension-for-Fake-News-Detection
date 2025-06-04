from flask import Flask, request, g, Response
from flask_cors import CORS
from utils.web_crawler import WebCrawler
from utils.preprocessing import *
from utils.text_classifier import models
from utils.db_connection import DBConnection
from datetime import datetime
import requests, json, time

app = Flask(__name__)
CORS(app)

results = DBConnection.getDB('testDB')['fake news']

@app.before_request
def beforeRequest():
    '''define variables that are used in all requests'''
    g.modelName = request.args.get('model', default='lgbm')
    g.req = request.get_json(silent=True)
    g.start = time.time()
    g.saveToDB = False


@app.post("/")
def hello_world():
    user = request.args.get('user', default='generic user')
    req = request.get_json(silent=True)
    return {'message': 'hello, ' + user, "req_type":req}

@app.post('/text/url')
def extractTextFromUrl():
    '''get a dom and get the text from it, then preprocess'''
    url = g.req['url']
    #define the default response dictionary
    res = {}
    try:
        #query the database, if entry exists extract result, else analyze text and save to database
        document = results.find_one({'url':url})
        if document is not None:
            res['result'] = document['result']
            res['model'] = document['model']
            res['date'] = document['date']
        else:
            dom = requests.get(url).text
            crawler = WebCrawler(dom)
            text = preprocess_text(crawler.extractText())

            if len(text) <= 200:
                return{'message':'No text extracted'}

            #update response dictionary, and save to database
            res['text'] = text
            res['result'] = models[g.modelName].predict(text)
            g.saveToDB = True
    except:
        return{'message':'Invalid url'}
    
    return res

@app.post('/text')
def extractText():
    '''preprocess text that is already received'''
    try:
        text = preprocess_text(g.req['text'])
        
        if len(text) == 0:
                return{'message':'No text pasted...'}
        
        result = models[g.modelName].predict(text)
    except:
        return{'message':'Error parsing the given text'}
    
    return {'text':text, 'result':result}

@app.after_request
def afterRequest(response: Response):
    '''finalize the response and send to client'''
    if response.content_type == "application/json":
        data = json.loads(response.get_data(as_text=True))
        data['model'] = g.modelName
        data["elapsedTime"] = time.time() - g.start
        
        #insert to db
        if g.saveToDB:
            record = {'url':g.req['url'], 
                      'model':g.modelName, 
                      'result':data['result'],
                      'date':datetime.now().strftime("%d-%B-%Y, %H:%M:%S")}
            
            results.insert_one(record)

        response.set_data(json.dumps(data))
    return response
    


if __name__ == '__main__':
    app.run(debug=True)