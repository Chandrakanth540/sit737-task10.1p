const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb+srv://chandra98au:6U1NUe5EeRyRjt6w@cluster0.aymawxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(express.static('public'));
app.use(express.json());
let db;
MongoClient.connect(mongoUri)
  .then(client => {
    db = client.db("mydatabase");
    console.log("✅ Connected to MongoDB successfully");
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`👤 User Profile API running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Gracefully exit the app
  });


/**
 * User Schema:
 * {
 *   fullname: string,
 *   phonenumber: string,
 *   username: string
 * }
 */

// Create a user
app.post('/users', async (req, res) => {
  const { fullname, phonenumber, username } = req.body;
  if (!fullname || !phonenumber || !username) {
    return res.status(400).json({ error: "All fields are required: fullname, phonenumber, username." });
  }

  const user = { fullname, phonenumber, username, createdAt: new Date() };
  const result = await db.collection("users").insertOne(user);
  res.status(201).json({ _id: result.insertedId, ...user });
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.json(users);
});

// Get a user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch {
    res.status(400).json({ error: "Invalid ID format." });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { fullname, phonenumber, username } = req.body;
  try {
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { fullname, phonenumber, username, updatedAt: new Date() } }
    );
    res.json(result);
  } catch {
    res.status(400).json({ error: "Invalid ID format or update failed." });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid ID format or deletion failed." });
  }
});

// Health check
app.get('/health', (req, res) => res.send("OK"));
