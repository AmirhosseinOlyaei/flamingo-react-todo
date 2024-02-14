require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

// Replace with your Airtable base details
const API_BASE_URL = "https://api.airtable.com/v0/";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.TABLE_NAME;
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const url = `${API_BASE_URL}${AIRTABLE_BASE_ID}/${TABLE_NAME}`;
const SORT_BY_LAST_MODIFIED_TIME =
  "?sort[0][field]=completed&sort[0][direction]=asc&sort[1][field]=lastModifiedTime&sort[1][direction]=asc";
const FETCH_AIRTABLE_URL = `${url}${SORT_BY_LAST_MODIFIED_TIME}`;

app.use(cors()); // Enable CORS
// { origin: "http://127.0.0.1:3000/" }
app.use(express.json()); // Middleware to parse JSON bodies

// Proxy endpoint for fetching todos from Airtable
app.get("/api/todos", async (req, res) => {
  // console.log("FETCH_AIRTABLE_URL", FETCH_AIRTABLE_URL);
  // process.exit(0);
  // return res.status(200).json({ todolist: [] });
  try {
    const response = await axios.get(FETCH_AIRTABLE_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// Endpoint for updating a specific todo item
app.patch("/api/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const airtableData = req.body;
  const updateURL = `${url}/${todoId}${SORT_BY_LAST_MODIFIED_TIME}`;

  try {
    const response = await axios.patch(updateURL, airtableData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error updating todo with ID ${todoId}:`, error);
    res.status(500).json({ message: "Error updating todo" });
  }
});

// Endpoint for deleting a specific todo item
app.delete("/api/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const deleteURL = `${url}/${todoId}`;

  try {
    await axios.delete(deleteURL, {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
    });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(`Error deleting todo with ID ${todoId}:`, error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// Endpoint for adding a new todo item
app.post("/api/todos", async (req, res) => {
  const newTodoData = req.body;

  try {
    const response = await axios.post(url, newTodoData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error adding new todo:", error);
    res.status(500).json({ message: "Error adding new todo" });
  }
});

console.log("Hello from server.js");
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
