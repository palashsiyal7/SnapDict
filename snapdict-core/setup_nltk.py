#!/usr/bin/env python3
"""
Setup script to download required NLTK resources.
Run this script once before starting the application to ensure all NLTK data is available.
"""

import nltk
import os
import sys

def download_nltk_resources():
    print("SnapDict: Downloading required NLTK resources...")
    
    # Create NLTK data directory if it doesn't exist
    nltk_data_dir = os.path.expanduser('~/nltk_data')
    os.makedirs(nltk_data_dir, exist_ok=True)
    
    # Resources needed for SnapDict
    resources = [
        'punkt',
        'wordnet',
        'stopwords',
        'averaged_perceptron_tagger',
        'omw-1.4'
    ]
    
    for resource in resources:
        print(f"Downloading {resource}...")
        try:
            nltk.download(resource)
            print(f"✓ Successfully downloaded {resource}")
        except Exception as e:
            print(f"✗ Error downloading {resource}: {e}")
            return False
    
    print("\nAll NLTK resources have been downloaded successfully!")
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("SnapDict - NLTK Resources Setup")
    print("=" * 60)
    
    success = download_nltk_resources()
    
    if success:
        print("\nSetup complete! You can now run the SnapDict application.")
        sys.exit(0)
    else:
        print("\nSetup failed. Please check the error messages above.")
        sys.exit(1) 