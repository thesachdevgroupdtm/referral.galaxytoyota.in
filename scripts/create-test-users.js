const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

async function createTestUsers() {
  let connection

  try {
    console.log("Connecting to database...")
    connection = await mysql.createConnection(dbConfig)

    // Hash passwords properly
    const testPassword = await bcrypt.hash("password", 12)
    const adminPassword = await bcrypt.hash("admin123", 12)
    const superAdminPassword = await bcrypt.hash("superadmin123", 12)

    console.log("Creating test users...")

    // Delete existing test users first
    await connection.execute("DELETE FROM users WHERE email IN (?, ?, ?)", [
      "test@example.com",
      "admin@galaxytoyota.com",
      "superadmin@galaxytoyota.com",
    ])

    // Create Test User
    await connection.execute(
      `
      INSERT INTO users (
        name, email, phone, password, referral_code, role, 
        email_verified, is_active, total_referrals, total_earnings, 
        available_balance, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE, 0, 0.00, 0.00, NOW(), NOW())
    `,
      ["Test User", "test@example.com", "1234567890", testPassword, "TES1234", "USER"],
    )

    // Create Admin User
    await connection.execute(
      `
      INSERT INTO users (
        name, email, phone, password, referral_code, role, 
        email_verified, is_active, total_referrals, total_earnings, 
        available_balance, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE, 0, 0.00, 0.00, NOW(), NOW())
    `,
      ["Admin User", "admin@galaxytoyota.com", "9876543210", adminPassword, "ADM1234", "ADMIN"],
    )

    // Create Super Admin User
    await connection.execute(
      `
      INSERT INTO users (
        name, email, phone, password, referral_code, role, 
        email_verified, is_active, total_referrals, total_earnings, 
        available_balance, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE, 0, 0.00, 0.00, NOW(), NOW())
    `,
      ["Super Admin", "superadmin@galaxytoyota.com", "5555555555", superAdminPassword, "SUP1234", "SUPER_ADMIN"],
    )

    console.log("✅ Test users created successfully!")
    console.log("")
    console.log("Login Credentials:")
    console.log("📧 Test User: test@example.com / password")
    console.log("👨‍💼 Admin: admin@galaxytoyota.com / admin123")
    console.log("🔑 Super Admin: superadmin@galaxytoyota.com / superadmin123")
    console.log("")
  } catch (error) {
    console.error("❌ Error creating test users:", error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

createTestUsers()
