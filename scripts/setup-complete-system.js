const mysql = require("mysql2/promise")

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

async function setupCompleteSystem() {
  let connection

  try {
    connection = await mysql.createConnection(dbConfig)
    console.log("Connected to database")

    // Create withdrawal_requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS withdrawal_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log("✅ Withdrawal requests table created")

    // Add is_read column to notifications
    try {
      await connection.execute(`
        ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT FALSE
      `)
      console.log("✅ Added is_read column to notifications")
    } catch (error) {
      if (error.code !== "ER_DUP_FIELDNAME") {
        throw error
      }
      console.log("✅ is_read column already exists")
    }

    // Insert cars data
    const carsData = [
      [
        "Toyota Camry 2024",
        "Toyota",
        "Camry",
        3200000,
        3500000,
        "The 2024 Toyota Camry combines efficiency, style, and reliability in one exceptional package. With its hybrid powertrain option and advanced safety features, it's the perfect choice for modern drivers.",
        "Hybrid",
        "CVT Automatic",
        2024,
        "Hybrid Available, 4 Doors, Automatic, Toyota Safety Sense 2.0",
        "/placeholder.svg?height=300&width=400",
        10000,
        true,
        true,
        300000,
      ],
      [
        "Toyota Corolla 2024",
        "Toyota",
        "Corolla",
        1800000,
        2000000,
        "The world's best-selling car gets even better. The 2024 Corolla offers exceptional fuel economy, advanced safety features, and a comfortable ride.",
        "Petrol",
        "CVT Automatic",
        2024,
        "Fuel Efficient, Compact, Automatic, Safety Features",
        "/placeholder.svg?height=300&width=400",
        8000,
        true,
        true,
        200000,
      ],
      [
        "Toyota RAV4 2024",
        "Toyota",
        "RAV4",
        4500000,
        4800000,
        "Adventure awaits with the 2024 RAV4. This compact SUV offers all-wheel drive capability, spacious interior, and Toyota's legendary reliability.",
        "Petrol",
        "Automatic",
        2024,
        "AWD, SUV, Spacious, Off-road Capable",
        "/placeholder.svg?height=300&width=400",
        12000,
        true,
        false,
        300000,
      ],
      [
        "Toyota Prius 2024",
        "Toyota",
        "Prius",
        2800000,
        3100000,
        "The pioneer of hybrid technology continues to lead the way. The 2024 Prius offers outstanding fuel efficiency and eco-friendly driving.",
        "Hybrid",
        "CVT Automatic",
        2024,
        "Hybrid, Eco-friendly, Fuel Efficient, Advanced Tech",
        "/placeholder.svg?height=300&width=400",
        9000,
        true,
        false,
        300000,
      ],
      [
        "Toyota Highlander 2024",
        "Toyota",
        "Highlander",
        5200000,
        5500000,
        "Perfect for families, the 2024 Highlander offers three rows of seating, advanced safety features, and impressive cargo space.",
        "Petrol",
        "Automatic",
        2024,
        "3-Row Seating, Family SUV, Spacious, Safety Features",
        "/placeholder.svg?height=300&width=400",
        15000,
        true,
        false,
        300000,
      ],
      [
        "Toyota Fortuner 2024",
        "Toyota",
        "Fortuner",
        3800000,
        4200000,
        "Built for adventure and daily driving alike. The Fortuner combines rugged capability with refined comfort.",
        "Diesel",
        "Automatic",
        2024,
        "4WD, SUV, Rugged, Premium Interior",
        "/placeholder.svg?height=300&width=400",
        11000,
        true,
        true,
        400000,
      ],
    ]

    for (const car of carsData) {
      try {
        await connection.execute(
          `
          INSERT IGNORE INTO cars (name, brand, model, price, original_price, description, fuel_type, transmission, year, features, image_url, referral_reward, is_active, is_popular, discount_amount) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          car,
        )
      } catch (error) {
        console.log(`Car ${car[0]} already exists or error inserting`)
      }
    }
    console.log("✅ Cars data inserted")

    // Update user referral counts and earnings
    await connection.execute(`
      UPDATE users SET total_referrals = (
        SELECT COUNT(*) FROM referrals WHERE referrer_id = users.id
      ) WHERE role != 'ADMIN' AND role != 'SUPERADMIN'
    `)

    await connection.execute(`
      UPDATE users SET total_earnings = (
        SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'completed'
      ) WHERE role != 'ADMIN' AND role != 'SUPERADMIN'
    `)

    await connection.execute(`
      UPDATE users SET available_balance = total_earnings WHERE role != 'ADMIN' AND role != 'SUPERADMIN'
    `)
    console.log("✅ User referral data updated")

    // Create welcome notifications for users
    const [users] = await connection.execute(`
      SELECT id FROM users WHERE role != 'ADMIN' AND role != 'SUPERADMIN'
    `)

    for (const user of users) {
      try {
        await connection.execute(
          `
          INSERT IGNORE INTO notifications (user_id, title, message, type, is_read, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `,
          [
            user.id,
            "Welcome to Galaxy Toyota!",
            "Thank you for joining our referral program. Start referring friends to earn rewards!",
            "welcome",
            false,
          ],
        )
      } catch (error) {
        // Ignore if notification already exists
      }
    }
    console.log("✅ Welcome notifications created")

    console.log("\n🎉 Complete system setup finished successfully!")
    console.log("\nYou can now:")
    console.log("1. Test notifications by clicking the bell icon")
    console.log("2. View real referral data in dashboards")
    console.log("3. Request withdrawals and approve them as admin")
    console.log("4. Browse cars and generate referral links")
  } catch (error) {
    console.error("❌ Setup failed:", error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

setupCompleteSystem()
