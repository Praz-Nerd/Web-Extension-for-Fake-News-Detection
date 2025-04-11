import joblib
import pandas as pd


class TextClassifier:
    '''Class that encapsulates a ML classifier trained on vectorized text.
    It contains the model and the specitifc vectorizer '''
    def __init__(self, model, vectorizer):
        self.model = model
        self.vectorizer = vectorizer

    def predict(self, text: str):
        '''Vectorizes and does a prediction using the model on one single string. Note: the text needs to be prepared for ML applications'''
        vector = pd.DataFrame(self.vectorizer.transform([text]).toarray(), columns=self.getVocabulary())
        return self.model.predict(vector)[0]
    
    def getVocabulary(self):
        '''Returns a list with the vocabulary stored in the vectorizer object'''
        return self.vectorizer.get_feature_names_out()
    

models = {
    'lgbm_tf_idf' : TextClassifier(joblib.load('backend/models/lgbm/model.pkl'),
                    joblib.load('backend/models/lgbm/tf_idf_vectorizer.pkl'))
}

