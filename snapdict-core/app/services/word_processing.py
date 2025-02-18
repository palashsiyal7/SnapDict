# app/services/word_processing.py
import nltk
from nltk.corpus import wordnet

def is_complex_word(word: str) -> bool:
    """Determine if a word is complex."""
    return len(word) > 6

def get_word_definition(word: str) -> str:
    """Get definition of a word."""
    synsets = wordnet.synsets(word)
    if synsets:
        return synsets[0].definition()
    return None