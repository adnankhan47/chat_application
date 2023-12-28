require("dotenv").config();
const express = require("express");
const OpenAi = require("openai");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const app = express();
const server = http.createServer(app);
const jwt = require('jsonwebtoken');
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASEURL, process.env.SUPABASEKEY);

const port = 5000;

// Initializing for conversation history
let allMessages = [{ "role": "system", "content": 'You are an AI chatbot. Respond to all input in 25 words or less' }];

app.get("/", async (req, res) => {
  res.send("hello");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("ask", async (msg) => {
    console.log("Received Message from the client:", msg);

    try {
      
      allMessages.push({ "role": "user", "content": msg });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: allMessages,
        max_tokens: 50,
      });

      const completion = response.choices[0].message['content'];

      const { data: upsertedData, error: upsertError } = await supabase
        .from("chat_logs")
        .upsert([{ message: msg + " : " + completion, timestamp: new Date() }]);

      if (upsertError) {
        console.error("Supabase upsert error:", upsertError);
        throw new Error(upsertError.message);
      }

      io.emit("chatMessage", completion);
      console.log('Message emitted to clients:', completion);

      // Updating the conversation history
      allMessages.push({ role: 'assistant', content: completion });

      // console.log("allmessages===>", allMessages);

    } catch (error) {
      console.error("Error in processing 'ask' event:", error.message);
    }
  });
});



app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {

    const { data: existingUsername, error: existingUsernameError } = await supabase
    .from("user")
    .select("*")
    .eq("username", username);

    if (existingUsername && existingUsername.length > 0) {
    return res.status(400).json({ error: "Username already exists" });
  }
    // Check if the user with the given email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("user")
      .select("*")
      .eq("email", email);

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Insert the new user into the "user" table
    const { data: newUser, error: newUserError } = await supabase
      .from("user")
      .upsert([{ username, email, password }]);
      // .upsert([{ username, email, password: hashedPassword }]);

  
    if (newUserError) {
      console.error("Supabase upsert error:", newUserError);
      return res.status(500).json({ error: "Error registering the user" });
    }

    res.status(201).json({ token,message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in processing 'register' event:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Checking for the user with the given email exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("user")
      .select("*")
      .eq("email", email);

    if (existingUserError) {
      console.error("Supabase select error:", existingUserError);
      return res.status(500).json({ error: "Error during login" });
    }

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Checking for the password matches
    const storedPassword = existingUser[0].password; 
    if (password !== storedPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // If everything is correct, return user data 
    const userData = {
      id: existingUser[0].id,
      username: existingUser[0].username,
      email: existingUser[0].email,
    };

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error in processing 'login' event:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});




server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



