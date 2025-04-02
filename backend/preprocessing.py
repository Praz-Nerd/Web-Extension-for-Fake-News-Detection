import numpy as np
import pandas as pd
import re
import nltk
from string import punctuation
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from nltk import pos_tag

# Extend punctuation list


def preprocess_text(text: str):
    punctuation += '’‘“”–'
    """Apply multiple text processing steps in sequence."""
    # Remove punctuation
    for p in punctuation:
        text = text.replace(p, ' ')
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    text = ' '.join(word for word in text.split() if word not in stop_words)

    # Lemmatization with POS tagging
    lemmatizer = WordNetLemmatizer()
    words = word_tokenize(text)
    pos_tags = pos_tag(words)
    
    def get_wordnet_pos(tag):
        """Convert POS tag to WordNet format"""
        if tag.startswith('J'):
            return wordnet.ADJ
        elif tag.startswith('V'):
            return wordnet.VERB
        elif tag.startswith('N'):
            return wordnet.NOUN
        elif tag.startswith('R'):
            return wordnet.ADV
        return wordnet.NOUN  # Default to noun
    
    text = ' '.join(lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in pos_tags)

    # Remove non-matching regex words
    pattern = re.compile(r"\b[A-Za-z]+\b")
    text = ' '.join(word for word in text.split() if pattern.fullmatch(word))
    
    # Convert to lowercase
    return text.lower()

