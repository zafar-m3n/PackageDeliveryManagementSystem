// Importing required modules
const express = require("express");
const Driver = require("./modules/driver.js");
const Package = require("./modules/package.js");

// Initialize express app
const app = express();
const PORT = 8080;

// In-memory storage for drivers and packages
let drivers = [];
let packages = [];

// Middleware to serve static files and parse URL-encoded data
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Function to serve the homepage
const getHome = (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
};

// Function to serve the 'Add Driver' page
const getAddDriver = (req, res) => {
  res.sendFile(__dirname + "/public/add-driver.html");
};

// Function to handle form submission for adding a new driver
const postAddDriver = (req, res) => {
  const { driver_name, driver_department, driver_licence, driver_isActive } =
    req.body;
  const newDriver = new Driver(
    driver_name,
    driver_department,
    driver_licence,
    driver_isActive === "on" // Convert checkbox value to boolean
  );
  drivers.push(newDriver); // Add the new driver to the drivers array
  res.redirect("/34082115/Durgka/list-drivers"); // Redirect to the drivers list page
};

// Function to serve the 'Delete Drivers' page
const getDeleteDrivers = (req, res) => {
  res.sendFile(__dirname + "/public/delete-driver.html");
};

// Function to handle deleting a specific driver based on query parameter
const getDeleteDriver = (req, res) => {
  const driverId = req.query.driver_id; // Get driver ID from query parameter
  const driverIndex = drivers.findIndex(
    (driver) => driver.driver_id === driverId
  );

  if (driverIndex !== -1) {
    // If driver exists
    drivers.splice(driverIndex, 1); // Remove the driver from the array
    res.redirect("/34082115/Durgka/list-drivers"); // Redirect to the drivers list page
  } else {
    res.redirect("/34082115/Durgka/invalid-data"); // Redirect to invalid data page if driver not found
  }
};

// Function to serve the 'Drivers List' page
const getListDrivers = (req, res) => {
  res.sendFile(__dirname + "/public/drivers-list.html");
};

// Function to provide drivers data in JSON format
const getDriversData = (req, res) => {
  res.json(drivers);
};

// Function to serve the 'Add Package' page
const getAddPackage = (req, res) => {
  res.sendFile(__dirname + "/public/add-package.html");
};

// Function to handle form submission for adding a new package
const postAddPackage = (req, res) => {
  const {
    package_title,
    package_weight,
    package_destination,
    description,
    isAllocated,
    driver_id,
  } = req.body;
  const newPackage = new Package(
    package_title,
    package_weight,
    package_destination,
    description,
    isAllocated === "on", // Convert checkbox value to boolean
    driver_id
  );
  packages.push(newPackage); // Add the new package to the packages array
  res.redirect("/34082115/Durgka/list-packages"); // Redirect to the packages list page
};

// Function to serve the 'Delete Packages' page
const getDeletePackages = (req, res) => {
  res.sendFile(__dirname + "/public/delete-package.html");
};

// Function to handle deleting a specific package based on query parameter
const getDeletePackage = (req, res) => {
  const packageId = req.query.package_id; // Get package ID from query parameter
  const packageIndex = packages.findIndex(
    (pkg) => pkg.package_id === packageId
  );

  if (packageIndex !== -1) {
    // If package exists
    packages.splice(packageIndex, 1); // Remove the package from the array
    res.redirect("/34082115/Durgka/list-packages"); // Redirect to the packages list page
  } else {
    res.redirect("/34082115/Durgka/invalid-data"); // Redirect to invalid data page if package not found
  }
};

// Function to serve the 'Packages List' page
const getListPackages = (req, res) => {
  res.sendFile(__dirname + "/public/packages-list.html");
};

// Function to provide packages data in JSON format
const getPackagesData = (req, res) => {
  res.json(packages);
};

// Function to serve the 'Invalid Data' page
const getInvalidData = (req, res) => {
  res.status(400).sendFile(__dirname + "/public/invalid-data.html");
};

// Function to handle 404 errors (Not Found)
const getNotFound = (req, res) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
};

// Route definitions for handling various HTTP GET and POST requests
app.get("/", getHome);

app.get("/34082115/Durgka/add-driver", getAddDriver);
app.post("/34082115/Durgka/add-driver", postAddDriver);

app.get("/34082115/Durgka/delete-drivers", getDeleteDrivers);
app.get("/34082115/Durgka/delete-driver", getDeleteDriver);

app.get("/34082115/Durgka/list-drivers", getListDrivers);
app.get("/34082115/Durgka/drivers-data", getDriversData);

app.get("/34082115/Durgka/add-package", getAddPackage);
app.post("/34082115/Durgka/add-package", postAddPackage);

app.get("/34082115/Durgka/delete-packages", getDeletePackages);
app.get("/34082115/Durgka/delete-package", getDeletePackage);

app.get("/34082115/Durgka/list-packages", getListPackages);
app.get("/34082115/Durgka/packages-data", getPackagesData);

app.get("/34082115/Durgka/invalid-data", getInvalidData);

// Catch-all route for handling undefined routes
app.get("*", getNotFound);

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
