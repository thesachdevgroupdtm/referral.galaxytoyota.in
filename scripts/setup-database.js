const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  try {
    console.log("🚀 Setting up Galaxy Toyota Referral Database...")

    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    })

    console.log("✅ Connected to MySQL server")

    // Read and execute SQL file
    const sqlFile = path.join(__dirname, "database-setup.sql")
    const sql = fs.readFileSync(sqlFile, "utf8")

    await connection.execute(sql)
    console.log("✅ Database and tables created successfully")

    await connection.end()
    console.log("🎉 Database setup completed!")

    console.log("\n📋 Default Login Credentials:")
    console.log("Super Admin: superadmin@galaxytoyota.com / password")
    console.log("Admin: admin@galaxytoyota.com / password")
    console.log("User: john@example.com / password")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    process.exit(1)
  }
}

setupDatabase()
