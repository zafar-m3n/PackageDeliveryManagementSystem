const express = require("express");
const Driver = require("./modules/driver.js");
const Package = require("./modules/package.js");

const app = express();
const PORT = 8080;

let drivers = [];
let packages = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const getHome = (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
};

const getAddDriver = (req, res) => {
  res.sendFile(__dirname + "/public/add-driver.html");
};

const postAddDriver = (req, res) => {
  const { driver_name, driver_department, driver_licence, driver_isActive } =
    req.body;
  const newDriver = new Driver(
    driver_name,
    driver_department,
    driver_licence,
    driver_isActive === "on"
  );
  drivers.push(newDriver);
  res.redirect("/34082115/Durgka/list-drivers");
};

const getDeleteDrivers = (req, res) => {
  res.sendFile(__dirname + "/public/delete-driver.html");
};

const getDeleteDriver = (req, res) => {
  const driverId = req.query.driver_id;
  const driverIndex = drivers.findIndex(
    (driver) => driver.driver_id === driverId
  );

  if (driverIndex !== -1) {
    drivers.splice(driverIndex, 1);
    res.redirect("/34082115/Durgka/list-drivers");
  } else {
    res.redirect("/34082115/Durgka/invalid-data");
  }
};

const getListDrivers = (req, res) => {
  res.sendFile(__dirname + "/public/drivers-list.html");
};

const getDriversData = (req, res) => {
  res.json(drivers);
};

const getAddPackage = (req, res) => {
  res.sendFile(__dirname + "/public/add-package.html");
};

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
    isAllocated === "on",
    driver_id
  );
  packages.push(newPackage);
  res.redirect("/34082115/Durgka/list-packages");
};

const getDeletePackages = (req, res) => {
  res.sendFile(__dirname + "/public/delete-package.html");
};

const getDeletePackage = (req, res) => {
  const packageId = req.query.package_id;
  const packageIndex = packages.findIndex(
    (pkg) => pkg.package_id === packageId
  );

  if (packageIndex !== -1) {
    packages.splice(packageIndex, 1);
    res.redirect("/34082115/Durgka/list-packages");
  } else {
    res.redirect("/34082115/Durgka/invalid-data");
  }
};

const getListPackages = (req, res) => {
  res.sendFile(__dirname + "/public/packages-list.html");
};

const getPackagesData = (req, res) => {
  res.json(packages);
};

const getInvalidData = (req, res) => {
  res.status(400).sendFile(__dirname + "/public/invalid-data.html");
};

const getNotFound = (req, res) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
};

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

app.get("*", getNotFound);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
