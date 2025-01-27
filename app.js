const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;
const mongourl = "mongodb+srv://dharshini001:dhar@cluster0.onf7x.mongodb.net/test";

// Connect to MongoDB
mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// Define Expense schema and model
const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
});

const expenseModel = mongoose.model("Expense", expenseSchema);

// Middleware for parsing JSON
app.use(express.json());

// Routes

// Get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await expenseModel.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// Get a single expense by ID
app.get("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseModel.findOne({ id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error.message);
    res.status(500).json({ message: "Failed to fetch expense" });
  }
});

// Create a new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount } = req.body;
    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const newExpense = new expenseModel({
      id: uuidv4(),
      title:title,
      amount:amount,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error creating expense:", error.message);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

// Update an existing expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const updatedExpense = await expenseModel.findOneAndUpdate(
      { id },
      { title, amount },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error.message);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// Delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await expenseModel.findOneAndDelete({ id });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

