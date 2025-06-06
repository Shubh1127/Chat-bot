from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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
    response = model.generate_content(prompt.message)
    return {"reply": response.text}

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Agent API"}

@app.post("/ask")
def ask(prompt: Prompt):
    return ask_agent(prompt)