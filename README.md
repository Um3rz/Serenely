# Serenely
<img width="849" alt="image" src="https://github.com/user-attachments/assets/62df44cc-b035-4f89-b683-54afe52b4876" />
<img width="865" height="383" alt="image" src="https://github.com/user-attachments/assets/6bfd2ec8-e478-470d-b241-0293b4fbc8b9" />

> **Your AI‑powered mental wellness companion**  
> An AI therapist chatbot with guided journaling and an anonymous peer‑support community.

## About

**Serenely** is an AI‑driven mental wellness app designed to help you explore your thoughts, manage stress, and connect with others—all in a safe, anonymous environment.  

- **AI Therapist**: Chat with an AI that listens empathetically and offers therapeutic insights.  
- **Guided Journaling**: Structured prompts to help you reflect and grow.  
- **Anonymous Community**: Share experiences and support peers without revealing your identity.

---

## Features

| Feature                    | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| 🤖 **AI Therapist Chatbot**   | Natural‑language conversation powered by state‑of‑the‑art AI.               |
| 📓 **Guided Journaling**       | Daily prompts, mood tracking, and progress summaries.                      |
| 🕵️‍♂️ **Anonymous Community**  | Topic‑based discussion boards—no usernames, no judgment.                   |
| 🔒 **Privacy First**           | End‑to‑end encryption, no personally identifiable data stored.             |

---

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS  
- **Backend**: NextJS backend deployed on AWS Fargate scaled using ECS(elastic container service)
- **AI & NLP**: OpenAI GPT‑4 API (or similar)  , OpenAI agent SDK
- **Database**: Postgres (for journals & community posts)  on AWS Aurora Serverless
- **Auth & Security**: JWT, bcrypt, HTTPS
  

---

## Getting Started

### Prerequisites

- Node.js ≥ 16  
- npm or Yarn  
- OpenAI API key  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your‑org/serenely.git
   cd serenely

