# app/services/word_processing.py
import nltk
import re
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
import logging
from functools import lru_cache  # For caching

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Common contractions and their expansions
CONTRACTIONS = {
    "ain't": "is not", "aren't": "are not", "can't": "cannot", 
    "couldn't": "could not", "didn't": "did not", "doesn't": "does not",
    "don't": "do not", "hadn't": "had not", "hasn't": "has not",
    "haven't": "have not", "he'd": "he would", "he'll": "he will",
    "he's": "he is", "i'd": "i would", "i'll": "i will", "i'm": "i am",
    "i've": "i have", "isn't": "is not", "it's": "it is",
    "let's": "let us", "mightn't": "might not", "mustn't": "must not",
    "shan't": "shall not", "she'd": "she would", "she'll": "she will",
    "she's": "she is", "shouldn't": "should not", "that's": "that is",
    "there's": "there is", "they'd": "they would", "they'll": "they will",
    "they're": "they are", "they've": "they have", "we'd": "we would",
    "we're": "we are", "we've": "we have", "weren't": "were not",
    "what'll": "what will", "what're": "what are", "what's": "what is",
    "what've": "what have", "where's": "where is", "who'd": "who would",
    "who'll": "who will", "who're": "who are", "who's": "who is",
    "who've": "who have", "won't": "will not", "wouldn't": "would not",
    "you'd": "you would", "you'll": "you will", "you're": "you are",
    "you've": "you have"
}

# Load stopwords
stop_words = set(stopwords.words('english'))

# Cache for word complexities - improves performance for repeated words
word_complexity_cache = {}

# A set of common words to quickly exclude from complex word detection
common_words = {
    'about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'alone', 
    'along', 'already', 'also', 'although', 'always', 'among', 'around', 'because',
    'before', 'behind', 'below', 'between', 'both', 'business', 'children', 'country',
    'during', 'each', 'early', 'enough', 'every', 'example', 'family', 'follow', 'found',
    'great', 'group', 'however', 'important', 'into', 'large', 'later', 'little', 'money',
    'month', 'more', 'most', 'mother', 'much', 'must', 'name', 'never', 'next', 'night',
    'often', 'only', 'other', 'over', 'people', 'place', 'point', 'problem', 'program',
    'question', 'right', 'room', 'school', 'small', 'something', 'state', 'still', 'story',
    'study', 'system', 'thing', 'think', 'through', 'time', 'today', 'under', 'until',
    'water', 'week', 'where', 'while', 'without', 'world', 'would', 'year', 'young'
}

def preprocess_text(text):
    """Clean and preprocess text for analysis."""
    # Convert to lowercase
    text = text.lower()
    
    # Expand contractions
    for contraction, expansion in CONTRACTIONS.items():
        text = text.replace(contraction, expansion)
    
    # Remove punctuation and replace with space
    text = re.sub(f"[{string.punctuation}]", " ", text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def get_wordnet_pos(tag):
    """Map POS tag to first character used by WordNet."""
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN  # Default to noun

def extract_complex_words(text, min_length=5, max_length=20):
    """Extract complex words from text efficiently."""
    # Preprocess text
    preprocessed_text = preprocess_text(text)
    
    # Tokenize words
    tokens = word_tokenize(preprocessed_text)
    
    # Fast initial filtering - use set operations for better performance
    filtered_tokens = [word for word in tokens 
                      if word.isalpha() 
                      and word not in stop_words 
                      and word not in common_words
                      and min_length <= len(word) <= max_length]
    
    if not filtered_tokens:
        return {}
    
    # Get part-of-speech tags only for filtered tokens - more efficient
    tagged_words = pos_tag(filtered_tokens)
    
    complex_words = {}
    for word, tag in tagged_words:
        # Get lemmatized form for better lookup
        pos = get_wordnet_pos(tag)
        lemma = lemmatizer.lemmatize(word, pos=pos)
        
        # Use cache to check if word is complex
        if lemma not in word_complexity_cache:
            complexity = is_complex_word(lemma)
            word_complexity_cache[lemma] = complexity
        else:
            complexity = word_complexity_cache[lemma]
        
        if complexity:
            # Get definition, examples, synonyms, etc.
            word_info = get_word_definition(lemma)
            if word_info:
                complex_words[lemma] = word_info
    
    return complex_words

def is_complex_word(word: str) -> bool:
    """Determine if a word is complex using a simplified algorithm."""
    # Quick check for common words
    if word in common_words or len(word) <= 4:
        return False
    
    # Fast lookup for complexity
    # Words with 3+ syllables are usually complex
    vowels = 'aeiouy'
    syllable_count = 0
    prev_is_vowel = False
    
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_is_vowel:
            syllable_count += 1
        prev_is_vowel = is_vowel
    
    # Adjust for words ending with 'e' which often doesn't count as a syllable
    if word.endswith('e') and syllable_count > 1:
        syllable_count -= 1
        
    # If it has many syllables or is long, it's likely complex
    if syllable_count >= 3 or len(word) >= 8:
        return True
        
    # Check if it contains complex letter combinations - only for shorter words
    if 4 < len(word) < 8:
        complex_patterns = ['ph', 'th', 'ch', 'wh', 'qu', 'ght']
        for pattern in complex_patterns:
            if pattern in word:
                return True
    
    return False

@lru_cache(maxsize=1000)  # Cache up to 1000 word definitions
def get_word_definition(word: str) -> dict:
    """Get comprehensive information about a word with caching for better performance."""
    synsets = wordnet.synsets(word)
    if not synsets:
        return None
    
    # Get the most common synset (usually the first one)
    primary_synset = synsets[0]
    
    # Get examples - limit lookup
    examples = primary_synset.examples()
    example = examples[0] if examples else ""
    
    # Get synonyms - limit synset traversal
    synonyms = []
    for synset in synsets[:2]:  # Reduced from 3 to 2
        for lemma in synset.lemmas()[:3]:  # Limit lemmas to first 3
            synonym = lemma.name().replace('_', ' ')
            if synonym != word and synonym not in synonyms:
                synonyms.append(synonym)
                if len(synonyms) >= 3:  # Stop after finding 3 synonyms
                    break
        if len(synonyms) >= 3:
            break
    
    # Get antonyms - more limited lookup
    antonyms = []
    for lemma in synsets[0].lemmas():  # Only use first synset
        for antonym in lemma.antonyms():
            antonym_name = antonym.name().replace('_', ' ')
            if antonym_name not in antonyms:
                antonyms.append(antonym_name)
                if len(antonyms) >= 2:  # Limit to 2 antonyms
                    break
    
    # Format the result
    word_info = {
        'definition': primary_synset.definition(),
        'example': example,
        'pos': primary_synset.pos(),
        'synonyms': synonyms,
        'antonyms': antonyms
    }
    
    return word_info