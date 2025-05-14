from pymongo import MongoClient

class DBConnection:
    _client = None
    '''A singleton class that handles the database connection with MongoDB'''
    @staticmethod
    def getDB(db:str):
        '''Get a MongoDB document database, from the default connection string'''
        if DBConnection._client is None:
            DBConnection._client = MongoClient("mongodb://localhost:27017/")
        return DBConnection._client[db]
    



