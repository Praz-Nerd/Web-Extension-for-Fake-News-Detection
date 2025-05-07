import joblib
import pandas as pd


class TextClassifier:
    '''Class that encapsulates a ML classifier trained on vectorized text.
    It contains the model and the specitifc vectorizer '''
    def __init__(self, model, vectorizer):
        self.model = model
        self.vectorizer = vectorizer

    def predict(self, text: str, proba = True, cls = 1):
        '''Vectorizes and does a prediction using the model on one single string. Returns probability for class 1 by default.
        
        Note: the text needs to be prepared for ML applications'''
        vector = pd.DataFrame(self.vectorizer.transform([text]).toarray(), columns=self.getVocabulary())
        if proba:
            return self.model.predict_proba(vector)[0][cls]
        
        return int(self.model.predict(vector)[0])
    
    def getVocabulary(self):
        '''Returns a list with the vocabulary stored in the vectorizer object'''
        return self.vectorizer.get_feature_names_out()
    

models = {
    'lgbm' : TextClassifier(joblib.load('backend/models/lgbm/model.pkl'),
                    joblib.load('backend/models/lgbm/tf_idf_vectorizer.pkl')),
    'new lgbm' : TextClassifier(joblib.load('backend/models/new lgbm/model.pkl'),
                    joblib.load('backend/models/new lgbm/vectorizer.pkl'))
}
