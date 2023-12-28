# Chat Application with AI Chatbot

## Overview

This repository contains the source code for a real-time chat application integrated with an AI chatbot. Users can register, log in, and engage in conversations with the AI chatbot.

### Features

- **Real-time Chat:** Utilizes WebSocket for real-time chat functionality.
- **AI Chatbot Integration:** Integrates with OpenAI's GPT or similar models for interactive conversations.
- **Database:** Stores user data and chat logs using PostgreSQL or Supabase.
- **Dockerized:** Containerized using Docker for easy deployment and scalability.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (backend)
- [npm](https://www.npmjs.com/) (backend)
- [Docker](https://www.docker.com/) (for containerization)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/adnankhan47/chat_application.git
switch to devlopment branch
  

Backend Setup

Navigate to the backend directory:
cd backend

Create a .env file in the backend directory and add the following:
.env:
OPENAI_API_KEY=<your-openai-api-key>
SUPABASEURL=<your-supabase-url>
SUPABASEKEY=<your-supabase-key>
JWT_SECRET=<your-jwt-secret>
Replace the placeholders with actual credentials(available in guide)

Install backend dependencies:
npm install

Run the backend server:
npm start

Frontend Setup
Open a new terminal window and navigate to the frontend directory:


cd frontend
Install frontend dependencies:


npm install
Run the frontend application:


npm start
Open your browser and visit http://localhost:3000 to access the chat application.

Usage
Register a new account or log in with existing credentials.
Engage in real-time conversations with the AI chatbot.
Explore and test the features of the chat application.

Docker Containerization
To run the application using Docker:

Build Docker images:
docker-compose build

Start Docker containers:
docker-compose up
Open your browser and visit http://localhost:3000 to access the chat application.


