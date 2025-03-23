import os
import json
from googletrans import Translator
from rapidfuzz import process, fuzz  

# ✅ FIX: Check if `CSI.json` Exists & Handle Errors
JSON_PATH = r"C:\Users\aritra basak\OneDrive\Desktop\farmer_final\chat\CSI.json"

def load_data():
    if not os.path.exists(JSON_PATH):
        print(f"❌ ERROR: CSI.json not found at {JSON_PATH}")
        return {}  # Return empty dictionary if file is missing

    try:
        with open(JSON_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)
            print("✅ JSON Loaded Successfully! Total Questions:", sum(len(v) for v in data.values()))
            return data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error loading CSI.json: {e}")
        return {}

data = load_data()
translator = Translator()

# ✅ Translate Text Function (Synchronous)
def translate_text(text, target_language="en"):
    """Translates text to the target language using Google Translate."""
    try:
        translation = translator.translate(text, dest=target_language)
        return translation.text
    except Exception as e:
        print(f"❌ Translation Error: {e}")
        return text  # Return original text if translation fails

# ✅ Find Best Match Function
def fetch_answer(user_query, user_lang="en"):
    """Find the most relevant answer using fuzzy matching after translation."""
    translated_query = translate_text(user_query, "en")  # Translate to English
    print(f"🔤 Translated Query: {translated_query}")  

    if not data:
        return translate_text("Sorry, the chatbot database is not available.", user_lang)

    questions_answers = [
        (faq["question"].lower(), faq["answer"])
        for category, faqs in data.items()
        if isinstance(faqs, list)
        for faq in faqs
        if isinstance(faq, dict) and "question" in faq and "answer" in faq
    ]

    if questions_answers:
        best_match = process.extractOne(
            translated_query.lower(), 
            [q[0] for q in questions_answers], 
            scorer=fuzz.token_sort_ratio
        )

        if best_match:
            matched_question, score, index = best_match
            print(f"✅ Best Match: {matched_question} | Score: {score}")  
            
            if score >= 60:
                answer = questions_answers[index][1]
                return translate_text(answer, user_lang)  # Translate back to user's language

    return translate_text("Sorry, I didn't understand that. Please try again.", user_lang)

# ✅ Chatbot Function
def chatbot(user_input, user_lang="en"):
    return fetch_answer(user_input, user_lang)

# ✅ Run chatbot in CLI mode
if __name__ == "__main__":
    print("Bot: Hi, How may I help you? (You can type in any language!)")
    while True:
        user_query = input("User: ")
        if user_query.lower() in ["exit", "quit"]:
            print("Exiting chatbot...")
            break
        user_lang = input("Enter Language Code (e.g., en for English, hi for Hindi, fr for French): ").strip().lower()
        print("Bot:", chatbot(user_query, user_lang))
