from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import tempfile
import google.generativeai as genai
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# Load .env if running locally
load_dotenv()

# --- STEP 1: Handle service account credentials securely ---
credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if credentials_json:
    with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.json') as tmp:
        tmp.write(credentials_json)
        tmp.flush()
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = tmp.name

# --- STEP 2: Configure Gemini API ---
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- STEP 3: Initialize LLM, memory, and chain ---
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
memory = ConversationBufferMemory()
conversation = ConversationChain(llm=llm, memory=memory, verbose=True)

# --- STEP 4: FastAPI Setup ---
app = FastAPI()

# Allow frontend hosted on Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chat-bot-one-pink.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- STEP 5: Pydantic model ---
class Prompt(BaseModel):
    message: str

# --- STEP 6: API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Agent API"}

@app.post("/ask")
def ask(prompt: Prompt):
    response = conversation.run(prompt.message)
    return {"reply": response}
