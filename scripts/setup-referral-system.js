const mysql = require("mysql2/promise")

async function setupReferralSystem() {
  console.log("Setting up referral system...")

  // Database configuration
  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "galaxy_toyota_referral",
  }

  try {
    // Connect to database
    console.log("Connecting to database...")
    const connection = await mysql.createConnection(dbConfig)
    console.log("Connected to database successfully!")

    // Create test users if they don't exist
    console.log("Creating test users...")
    await connection.execute(`
      INSERT INTO users (name, email, password, role, referral_code, phone, is_active, created_at, updated_at)
      SELECT 'Harsh Patel', 'harsh@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'HARSH123', '9876543210', TRUE, NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'harsh@example.com')
    `)

    await connection.execute(`
      INSERT INTO users (name, email, password, role, referral_code, phone, is_active, created_at, updated_at)
      SELECT 'Atul Kumar', 'atul@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ATUL456', '9876543211', TRUE, NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'atul@example.com')
    `)

    // Get user IDs
    const [harshResult] = await connection.execute("SELECT id FROM users WHERE email = ?", ["harsh@example.com"])
    const [atulResult] = await connection.execute("SELECT id FROM users WHERE email = ?", ["atul@example.com"])

    if (harshResult.length > 0 && atulResult.length > 0) {
      const harshId = harshResult[0].id
      const atulId = atulResult[0].id

      // Create referral from Harsh to Atul if it doesn't exist
      console.log("Creating referral relationship...")
      await connection.execute(
        `
        INSERT INTO referrals (referrer_id, referee_name, referee_email, referee_phone, status, reward_amount, created_at, updated_at)
        SELECT ?, 'Atul Kumar', 'atul@example.com', '9876543211', 'completed', 10000, NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM referrals WHERE referrer_id = ? AND referee_email = 'atul@example.com')
      `,
        [harshId, harshId],
      )

      // Update user earnings
      console.log("Updating user earnings...")
      await connection.execute(
        `
        UPDATE users 
        SET total_earnings = 10000, available_balance = 10000 
        WHERE id = ?
      `,
        [harshId],
      )

      // Create notification for Harsh
      console.log("Creating notifications...")
      await connection.execute(
        `
        INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
        SELECT ?, 'Referral Approved! 🎉', 'Your referral for Atul Kumar has been approved! You earned ₹10,000.', 'referral_update', NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = ? AND type = 'referral_update')
      `,
        [harshId, harshId],
      )
    }

    // Create sample cars if they don't exist
    console.log("Creating sample cars...")
    const carModels = [
      {
        name: "Toyota Fortuner",
        brand: "Toyota",
        model: "Fortuner",
        price: 3500000,
        year: 2025,
        fuel_type: "Diesel",
        transmission: "Automatic",
        is_popular: true,
      },
      {
        name: "Toyota Innova Crysta",
        brand: "Toyota",
        model: "Innova Crysta",
        price: 2200000,
        year: 2025,
        fuel_type: "Petrol",
        transmission: "Automatic",
        is_popular: true,
      },
      {
        name: "Toyota Camry",
        brand: "Toyota",
        model: "Camry",
        price: 4500000,
        year: 2025,
        fuel_type: "Hybrid",
        transmission: "Automatic",
        is_popular: true,
      },
      {
        name: "Toyota Glanza",
        brand: "Toyota",
        model: "Glanza",
        price: 850000,
        year: 2025,
        fuel_type: "Petrol",
        transmission: "Manual",
        is_popular: false,
      },
      {
        name: "Toyota Urban Cruiser",
        brand: "Toyota",
        model: "Urban Cruiser",
        price: 1100000,
        year: 2025,
        fuel_type: "Petrol",
        transmission: "Manual",
        is_popular: false,
      },
      {
        name: "Toyota Vellfire",
        brand: "Toyota",
        model: "Vellfire",
        price: 9000000,
        year: 2025,
        fuel_type: "Hybrid",
        transmission: "Automatic",
        is_popular: false,
      },
    ]

    for (const car of carModels) {
      await connection.execute(
        `
        INSERT INTO cars (name, brand, model, price, year, fuel_type, transmission, description, features, referral_reward, is_active, is_popular, created_at, updated_at)
        SELECT ?, ?, ?, ?, ?, ?, ?, 'Experience luxury and performance with the all-new ${car.name}.', 'Air Conditioning, Power Steering, Anti Lock Braking System, Driver Airbag, Passenger Airbag, Automatic Climate Control', 10000, TRUE, ?, NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM cars WHERE name = ? AND model = ?)
      `,
        [
          car.name,
          car.brand,
          car.model,
          car.price,
          car.year,
          car.fuel_type,
          car.transmission,
          car.is_popular,
          car.name,
          car.model,
        ],
      )
    }

    console.log("Referral system setup completed successfully!")
    await connection.end()
  } catch (error) {
    console.error("Error setting up referral system:", error)
    process.exit(1)
  }
}

setupReferralSystem()
