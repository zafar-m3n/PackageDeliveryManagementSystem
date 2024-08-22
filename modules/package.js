class Package {
    constructor(
      package_title,
      package_weight,
      package_destination,
      description,
      isAllocated,
      driver_id
    ) {
      this.package_id = this.generatePackageId();
      this.package_title = package_title;
      this.package_weight = package_weight;
      this.package_destination = package_destination;
      this.description = description;
      this.createdAt = new Date();
      this.isAllocated = isAllocated;
      this.driver_id = driver_id;
    }
    generatePackageId() {
      const randomChars = () =>
        Math.random().toString(36).substring(2, 4).toUpperCase();
      const randomDigits = () => Math.floor(Math.random() * 900 + 100);
      const initials = "DA";
      return `P${randomChars()}-${initials}-${randomDigits()}`;
    }
  }

  module.exports = Package;