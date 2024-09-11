// Importing required modules
const express = require("express");
const { MongoClient } = require("mongodb");
const ejs = require("ejs");
const Driver = require("./models/driver.js");
const Package = require("./models/package.js");

// Configure Express
const app = express();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Start the server on port 8080
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

// MongoDB connection settings
let db;
let driverCollection;
let packageCollection;

// Connection URL
// const url = "mongodb://localhost:27017";

const url =
  "mongodb+srv://admin:adminPassword@cluster0.sbk4qxz.mongodb.net/InternConnect";
const client = new MongoClient(url);

// Connect to MongoDB
async function main() {
  await client.connect();
  db = client.db("package_delivery");
  driverCollection = db.collection("drivers");
  packageCollection = db.collection("packages");
  console.log("Connected successfully to MongoDB server.");
}

main().then(console.log).catch(console.error);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/34082115/Durgka/api/v1/drivers", async (req, res) => {
  const { driver_name, driver_department, driver_licence, driver_isActive } =
    req.body;

  try {
    const newDriver = new Driver({
      driver_name,
      driver_department,
      driver_licence,
      driver_isActive: driver_isActive === "on",
    });

    const insertResult = await driverCollection.insertOne(newDriver);

    res.status(201).json({
      driver_id: newDriver.driver_id,
      _id: insertResult.insertedId,
    });
  } catch (error) {
    console.error("Error inserting driver:", error);
    res.status(500).json({ message: "Error adding driver", error });
  }
});

// 2. List all Drivers (GET)
app.get("/34082115/Durgka/api/v1/drivers", async (req, res) => {
  try {
    const drivers = await driverCollection.find({}).toArray();
    res.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Error fetching drivers", error });
  }
});

// 3. Delete Driver by ID (DELETE)
app.delete("/34082115/Durgka/api/v1/drivers/:driver_id", async (req, res) => {
  const { driver_id } = req.params;

  try {
    const deleteResult = await driverCollection.deleteOne({ driver_id });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Error deleting driver", error });
  }
});

// 4. Update driver license and department by ID (PUT)
app.put("/34082115/Durgka/api/v1/drivers/:driver_id", async (req, res) => {
  const { driver_id } = req.params;
  const { driver_licence, driver_department } = req.body;

  try {
    const updateResult = await driverCollection.updateOne(
      { driver_id },
      { $set: { driver_licence, driver_department } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Driver updated successfully" });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Error updating driver", error });
  }
});

// 5. Insert a new Package (POST)
app.post("/34082115/Durgka/api/v1/packages", async (req, res) => {
  const {
    package_title,
    package_weight,
    package_destination,
    description,
    isAllocated,
    driver_id,
  } = req.body;

  try {
    const newPackage = new Package({
      package_title,
      package_weight,
      package_destination,
      description,
      isAllocated: isAllocated === "on",
      driver_id,
    });

    const insertResult = await packageCollection.insertOne(newPackage);
    res.status(201).json(newPackage);
  } catch (error) {
    console.error("Error inserting package:", error);
    res.status(500).json({ message: "Error adding package", error });
  }
});

// 6. List all Packages (GET)
app.get("/34082115/Durgka/api/v1/packages", async (req, res) => {
  try {
    const packages = await packageCollection.find({}).toArray();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Error fetching packages", error });
  }
});

// 7. Delete Package by ID (DELETE)
app.delete("/34082115/Durgka/api/v1/packages/:package_id", async (req, res) => {
  const { package_id } = req.params;

  try {
    const deleteResult = await packageCollection.deleteOne({ package_id });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Error deleting package", error });
  }
});

// 8. Update package destination by ID (PUT)
app.put("/34082115/Durgka/api/v1/packages/:package_id", async (req, res) => {
  const { package_id } = req.params;
  const { package_destination } = req.body;

  try {
    const updateResult = await packageCollection.updateOne(
      { package_id },
      { $set: { package_destination } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "Package updated successfully" });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Error updating package", error });
  }
});

// Function to serve the 'Invalid Data' page
app.get("/34082115/Durgka/invalid-data", (req, res) => {
  res.status(400).sendFile(__dirname + "/invalid-data.html");
});

// Catch-all route for 404 errors
app.get("/34082115/Durgka/*", (req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});
