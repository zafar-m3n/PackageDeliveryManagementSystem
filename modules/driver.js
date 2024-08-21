class Driver {
    constructor(driver_name, driver_department, driver_licence, driver_isActive) {
      this.driver_id = this.generateDriverId();
      this.driver_name = driver_name;
      this.driver_department = driver_department;
      this.driver_licence = driver_licence;
      this.driver_isActive = driver_isActive;
      this.driver_createdAt = new Date();
    }
  
    generateDriverId() {
      const randomLetters = () =>
        Math.random().toString(36).substring(2, 5).toUpperCase();
      const studentIdDigits = "34";
      return `D${Math.floor(
        Math.random() * 90 + 10
      )}-${studentIdDigits}-${randomLetters()}`;
    }
  }
  module.exports= Driver;