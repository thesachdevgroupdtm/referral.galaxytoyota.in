const mysql = require("mysql2/promise")

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

async function completeDatabaseFix() {
  let connection

  try {
    connection = await mysql.createConnection(dbConfig)
    console.log("🔗 Connected to database")

    // Drop and recreate referrals table with correct structure
    console.log("🔄 Fixing referrals table...")
    await connection.execute("DROP TABLE IF EXISTS referrals")
    await connection.execute(`
      CREATE TABLE referrals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referrer_id INT NOT NULL,
        referee_name VARCHAR(255) NOT NULL,
        referee_email VARCHAR(255) NOT NULL,
        referee_phone VARCHAR(20),
        car_id INT,
        referral_code VARCHAR(50),
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
        reward_amount DECIMAL(10, 2) DEFAULT 10000.00,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
      )
    `)
    console.log("✅ Referrals table recreated")

    // Drop and recreate cars table with correct structure
    console.log("🔄 Fixing cars table...")
    await connection.execute("DROP TABLE IF EXISTS cars")
    await connection.execute(`
      CREATE TABLE cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) DEFAULT 'Toyota',
        model VARCHAR(100),
        price DECIMAL(12, 2) NOT NULL,
        original_price DECIMAL(12, 2),
        description TEXT,
        fuel_type VARCHAR(50) DEFAULT 'Petrol',
        transmission VARCHAR(50) DEFAULT 'Automatic',
        year INT DEFAULT 2024,
        features TEXT,
        image_url VARCHAR(500) DEFAULT '/placeholder.svg?height=300&width=400',
        referral_reward DECIMAL(10, 2) DEFAULT 10000.00,
        friend_discount DECIMAL(10, 2) DEFAULT 5000.00,
        is_active BOOLEAN DEFAULT TRUE,
        is_popular BOOLEAN DEFAULT FALSE,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log("✅ Cars table recreated")

    // Insert Toyota cars data
    console.log("🚗 Inserting cars data...")
    const carsData = [
      [
        "Toyota Camry 2024",
        "Toyota",
        "Camry",
        3200000,
        3500000,
        "The 2024 Toyota Camry combines efficiency, style, and reliability in one exceptional package. With its hybrid powertrain option and advanced safety features, it is the perfect choice for modern drivers.",
        "Hybrid",
        "CVT Automatic",
        2024,
        "Hybrid Available, 4 Doors, Automatic, Toyota Safety Sense 2.0",
        "/placeholder.svg?height=300&width=400",
        10000,
        5000,
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
        4000,
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
        6000,
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
        4500,
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
        7500,
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
        5500,
        true,
        true,
        400000,
      ],
    ]

    for (const car of carsData) {
      await connection.execute(
        `INSERT INTO cars (name, brand, model, price, original_price, description, fuel_type, transmission, year, features, image_url, referral_reward, friend_discount, is_active, is_popular, discount_amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        car,
      )
    }
    console.log("✅ Cars data inserted")

    // Create withdrawal_requests table
    console.log("💰 Creating withdrawal requests table...")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS withdrawal_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log("✅ Withdrawal requests table created")

    // Add is_read column to notifications
    try {
      await connection.execute("ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT FALSE")
      console.log("✅ Added is_read column to notifications")
    } catch (error) {
      if (error.code !== "ER_DUP_FIELDNAME") {
        throw error
      }
      console.log("✅ is_read column already exists")
    }

    // Insert sample referrals for testing
    console.log("👥 Creating sample referrals...")
    const [harshUser] = await connection.execute("SELECT id FROM users WHERE email = 'harsh@example.com' LIMIT 1")
    if (harshUser.length > 0) {
      const harshId = harshUser[0].id

      await connection.execute(
        `INSERT INTO referrals (referrer_id, referee_name, referee_email, referee_phone, car_id, referral_code, status, reward_amount, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          harshId,
          "Atul Kumar",
          "atul@example.com",
          "9876543210",
          1,
          "HAR7878",
          "pending",
          10000,
          "Referred Toyota Camry",
        ],
      )

      await connection.execute(
        `INSERT INTO referrals (referrer_id, referee_name, referee_email, referee_phone, car_id, referral_code, status, reward_amount, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          harshId,
          "Priya Sharma",
          "priya@example.com",
          "9876543211",
          2,
          "HAR7878",
          "completed",
          8000,
          "Referred Toyota Corolla",
        ],
      )
      console.log("✅ Sample referrals created for Harsh")
    }

    // Update user statistics
    console.log("📊 Updating user statistics...")
    await connection.execute(`
      UPDATE users SET 
        total_referrals = (SELECT COUNT(*) FROM referrals WHERE referrer_id = users.id),
        total_earnings = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'completed'),
        available_balance = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'completed')
      WHERE role != 'ADMIN' AND role != 'SUPERADMIN'
    `)
    console.log("✅ User statistics updated")

    // Create welcome notifications
    console.log("🔔 Creating welcome notifications...")
    const [users] = await connection.execute("SELECT id FROM users WHERE role != 'ADMIN' AND role != 'SUPERADMIN'")

    for (const user of users) {
      try {
        await connection.execute(
          `INSERT IGNORE INTO notifications (user_id, title, message, type, is_read, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
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

    console.log("\n🎉 Complete database fix finished successfully!")
    console.log("\n✅ Fixed Issues:")
    console.log("1. ✅ Referrals table structure corrected")
    console.log("2. ✅ Cars table populated with Toyota vehicles")
    console.log("3. ✅ Admin dashboard will now show real data")
    console.log("4. ✅ Withdrawal system tables created")
    console.log("5. ✅ Notifications system ready")
    console.log("6. ✅ Sample referrals created for testing")

    console.log("\n🚀 Next Steps:")
    console.log("1. Restart your development server: npm run dev")
    console.log("2. Test admin dashboard - should show real user counts")
    console.log("3. Test cars page - should show 6 Toyota cars")
    console.log("4. Test referral creation and approval")
    console.log("5. Test withdrawal requests")
  } catch (error) {
    console.error("❌ Database fix failed:", error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

completeDatabaseFix()
