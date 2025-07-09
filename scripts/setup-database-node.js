const { Sequelize } = require("sequelize")
const bcrypt = require("bcrypt")
const { User } = require("../models") // Adjust the path as needed

// Database connection configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: process.env.DB_PORT || 5432,
  logging: false, // Disable logging for cleaner output
})

async function setupDatabase() {
  try {
    // Test the database connection
    await sequelize.authenticate()
    console.log("Connection to the database has been established successfully.")

    // Sync the models with the database (creates tables if they don't exist)
    await sequelize.sync({ force: true }) // Use force: true to drop existing tables
    console.log("Database synced.")

    // Update the test users with correct password hashes
    const testUsers = [
      {
        name: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("password", 10), // password
        role: "USER",
        referral_code: "TEST001",
      },
      {
        name: "Admin User",
        email: "admin@galaxytoyota.com",
        password: await bcrypt.hash("admin123", 10), // admin123
        role: "ADMIN",
        referral_code: "ADMIN001",
      },
      {
        name: "Super Admin",
        email: "superadmin@galaxytoyota.com",
        password: await bcrypt.hash("superadmin123", 10), // superadmin123
        role: "SUPERADMIN",
        referral_code: "SUPER001",
      },
    ]

    // Create the test users
    for (const user of testUsers) {
      await User.create(user)
      console.log(`Created user: ${user.email}`)
    }

    console.log("Test users created successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  } finally {
    // Close the database connection
    await sequelize.close()
    console.log("Database connection closed.")
  }
}

// Execute the setup function
setupDatabase()
