from fastapi import FastAPI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
llm=ChatGoogleGenerativeAI(model="gemini-2.0-flash")
memory=ConversationBufferMemory()

conversation=ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True,
)
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    message:str

model=genai.GenerativeModel("gemini-2.0-flash")

def ask_agent(prompt: Prompt):
    response = conversation.run(prompt.message)
    return {"reply": response}

@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Welcome to the AI Agent API"}

@app.post("/ask")
def ask(prompt: Prompt):
    return ask_agent(prompt)