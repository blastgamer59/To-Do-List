const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const uri =
  "mongodb+srv://admin:admin@to-do.u153m.mongodb.net/?retryWrites=true&w=majority&appName=To-do";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const todocollection = client.db("database").collection("tasks");
    app.post("/api/item", async (req, res) => {
      try {
        const newItem = { item: req.body.item };
        const result = await todocollection.insertOne(newItem);
        res.status(200).json({ _id: result.insertedId });
      } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).json({ error: "Error inserting task" });
      }
    });

    app.get("/api/items", async (req, res) => {
      try {
        const allItems = await todocollection.find({}).toArray();
        res.status(200).json(allItems);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Error fetching tasks" });
      }
    });

    app.patch("/api/item/:id/completed", async (req, res) => {
      try {
        const updateItem = await todocollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { completed: req.body.completed } }
        );
        res.status(200).json(updateItem);
      } catch (error) {
        console.error("Error updating task completion:", error);
        res.status(500).json({ error: "Error updating task completion" });
      }
    });

    app.put("/api/item/:id", async (req, res) => {
      try {
        const updateItem = await todocollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        res.status(200).json(updateItem);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Error updating task" });
      }
    });

    app.delete("/api/item/:id", async (req, res) => {
      try {
        const deleteItem = await todocollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        if (deleteItem.deletedCount === 1) {
          res.status(200).json("Item deleted successfully");
        } else {
          res.status(404).json("Item not found");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Error deleting task" });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("To-Do App is running");
});

app.listen(port, () => {
  console.log(`To-Do app backend running on port ${port}`);
});
