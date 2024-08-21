const express = require("express");
const Driver = require("./modules/driver.js");
const Package = require("./modules/package.js");

const app = express();
const PORT = 8080;

let drivers = [];
let packages = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/add-driver", (req, res) => {
  const { driver_name, driver_department, driver_licence, driver_isActive } =
    req.body;
  const newDriver = new Driver(
    driver_name,
    driver_department,
    driver_licence,
    driver_isActive === "on"
  );
  drivers.push(newDriver);
  res.redirect("/list-drivers");
});

app.get("/delete-driver", (req, res) => {
  const driverId = req.query.driver_id;

  const driverIndex = drivers.findIndex(
    (driver) => driver.driver_id === driverId
  );

  if (driverIndex !== -1) {
    drivers.splice(driverIndex, 1);
    res.redirect("/list-drivers");
  } else {
    res.redirect("/invalid-data");
  }
});

app.get("/list-drivers", (req, res) => {
  res.sendFile(__dirname + "/public/drivers-list.html");
});

app.get("/drivers-data", (req, res) => {
  res.json(drivers);
});

app.post("/add-package", (req, res) => {
  const {package_title, package_weight, package_destination, description,isAllocated,driver_id} = 
    req.body;
  const newPackage = new Package(
    package_title,
    package_weight,
    package_destination,
    description,
    isAllocated === "yes",
    driver_id
  );
  packages.push(newPackage);
  res.redirect("/list-packages");
});


app.get("/delete-package", (req, res) => {
  const packageId = req.query.package_id;

  const packageIndex = packages.findIndex(
    (package) => package.package_id === packageId
  );

  if (packageIndex !== -1) {
    packages.splice(packageIndex, 1);
    res.redirect("/list-packages");
  } else {
    res.redirect("/invalid-data");
  }
});

app.get("/list-packages", (req, res) => {
  res.sendFile(__dirname + "/public/packages-list.html");
});

app.get("/packages-data", (req, res) => {
  res.json(packages);
});

app.get("/invalid-data", (req, res) => {
  res.status(400).sendFile(__dirname + "/public/invalid-data.html");
});

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});