// Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const Driver = require("./models/driver.js");
const Package = require("./models/package.js");

// Firebase Admin SDK for Firestore (to save CRUD counters)
const admin = require("firebase-admin");
// Load Firebase service account key
const serviceAccount = require("./service-account.json");
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore(); // Access Firestore

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
const url = "mongodb://localhost:27017/assignment-2";

// Connect to MongoDB using Mongoose
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected successfully to MongoDB server.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Initialize Firestore counters for CRUD operations
const countersDoc = db.collection('crudCounters').doc('operationCounters');

// Function to increment the counter for each CRUD operation
async function incrementCounter(operation) {
  const doc = await countersDoc.get();
  const currentCounters = doc.exists ? doc.data() : { create: 0, read: 0, update: 0, delete: 0 };

  const updatedCounters = { ...currentCounters };
  updatedCounters[operation] += 1;

  await countersDoc.set(updatedCounters);
}

// Serve the index page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// 1. Add a new driver (POST)
app.post("/34082115/Durgka/api/v1/drivers", async (req, res) => {
  const { driver_name, driver_department, driver_licence, driver_isActive } = req.body;

  try {
    const newDriver = new Driver({
      driver_name,
      driver_department,
      driver_licence,
      driver_isActive,
    });

    const savedDriver = await newDriver.save();
    await incrementCounter('create'); // Increment Create counter

    res.status(201).json({
      id: savedDriver._id,
      driver_id: savedDriver.driver_id,
    });
  } catch (error) {
    console.error("Error inserting driver:", error);
    res.status(500).json({ message: "Error adding driver", error });
  }
});

// 2. List all drivers (GET)
app.get("/34082115/Durgka/api/v1/drivers", async (req, res) => {
  try {
    const drivers = await Driver.find({}).populate("assigned_packages").exec();
    await incrementCounter('read'); // Increment Read counter
    res.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Error fetching drivers", error });
  }
});

// 3. Delete driver by ID (DELETE)
app.delete("/34082115/Durgka/api/v1/drivers/:driver_id", async (req, res) => {
  const { driver_id } = req.params;

  try {
    const driver = await Driver.findOne({ driver_id });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const deletePackagesResult = await Package.deleteMany({ _id: { $in: driver.assigned_packages } });
    const deleteDriverResult = await Driver.deleteOne({ driver_id });

    await incrementCounter('delete'); // Increment Delete counter

    res.json({
      acknowledged: true,
      deletedCount: deleteDriverResult.deletedCount + deletePackagesResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting driver and packages:", error);
    res.status(500).json({ message: "Error deleting driver and packages", error });
  }
});

// 4. Update driver license and department by ID (PATCH)
app.patch("/34082115/Durgka/api/v1/drivers", async (req, res) => {
  const { id, driver_licence, driver_department } = req.body;

  try {
    const updateResult = await Driver.updateOne(
      { _id: id },
      { $set: { driver_licence, driver_department } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ status: "ID not found" });
    }

    await incrementCounter('update'); // Increment Update counter

    res.json({ status: "Driver updated successfully" });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ status: "Error updating driver", error });
  }
});

// 5. Insert a new package (POST)
app.post("/34082115/Durgka/api/v1/packages/add", async (req, res) => {
  const {
    package_title,
    package_weight,
    package_destination,
    isAllocated,
    driver_id,
  } = req.body;

  try {
    const newPackage = new Package({
      package_title,
      package_weight,
      package_destination,
      isAllocated,
      driver_id,
    });

    const savedPackage = await newPackage.save();
    await Driver.updateOne(
      { driver_id },
      { $push: { assigned_packages: savedPackage._id } }
    );

    await incrementCounter('create'); // Increment Create counter

    res.status(201).json({
      id: savedPackage._id,
      package_id: savedPackage.package_id,
    });
  } catch (error) {
    console.error("Error adding package:", error);
    res.status(500).json({ message: "Error adding package", error });
  }
});

// 6. List all packages (GET)
app.get("/34082115/Durgka/api/v1/packages", async (req, res) => {
  try {
    const packages = await Package.find({}).populate("driver_id").exec();
    await incrementCounter('read'); // Increment Read counter
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Error fetching packages", error });
  }
});

// 7. Delete package by ID (DELETE)
app.delete("/34082115/Durgka/api/v1/packages/:package_id", async (req, res) => {
  const { package_id } = req.params;

  try {
    const deleteResult = await Package.deleteOne({ package_id });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    await Driver.updateMany(
      { assigned_packages: package_id },
      { $pull: { assigned_packages: package_id } }
    );

    await incrementCounter('delete'); // Increment Delete counter

    res.json({
      acknowledged: true,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Error deleting package", error });
  }
});

// 8. Update package destination by ID (PATCH)
app.patch("/34082115/Durgka/api/v1/packages/update", async (req, res) => {
  const { package_id, package_destination } = req.body;

  try {
    const updateResult = await Package.updateOne(
      { package_id },
      { $set: { package_destination } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ status: "Package ID not found" });
    }

    await incrementCounter('update'); // Increment Update counter

    res.json({ status: "Package updated successfully" });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ status: "Error updating package", error });
  }
});

// 9. Serve the CRUD counters page
app.get("/34082115/Durgka/stats", async (req, res) => {
  try {
    const counters = (await countersDoc.get()).data() || {
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
    };

    res.render("stats.html", {
      studentId: req.params.studentId,
      firstName: req.params.firstName,
      counters,
    });
  } catch (error) {
    console.error("Error fetching CRUD stats:", error);
    res.status(500).json({ message: "Error fetching CRUD stats", error });
  }
});

// Serve the invalid data page
app.get("/34082115/Durgka/invalid-data", (req, res) => {
  res.status(400).sendFile(__dirname + "/invalid-data.html");
});

// Serve the 404 page for unknown routes
app.get("/34082115/Durgka/*", (req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});