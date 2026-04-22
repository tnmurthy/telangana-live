import sys
import os

# Add the directory containing llm_provider.py to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llm_provider import llm

def test_ollama():
    print("Testing Ollama connectivity...")
    # Use a common model name as a test
    test_model = "llama3" 
    test_prompt = "Hello, are you there? Reply with 'Yes, Ollama is working!'"
    
    result = llm.generate(test_prompt, provider="ollama", model=test_model)
    
    if result.get("text"):
        print(f"Success! Response: {result['text']}")
    else:
        print(f"Failed. Error: {result.get('error')}")

if __name__ == "__main__":
    test_ollama()
