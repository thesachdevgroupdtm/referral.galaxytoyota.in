import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig)

    try {
      // First check if cars table exists and has data
      const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'cars'")
      if (tableCheck.length === 0) {
        return NextResponse.json({ error: "Cars table not found", cars: [] }, { status: 500 })
      }

      // Check table structure
      const [columns] = await connection.execute("DESCRIBE cars")
      console.log(
        "Cars table columns:",
        columns.map((c) => c.Field),
      )

      const [cars] = await connection.execute(`
        SELECT 
          id,
          name,
          brand,
          model,
          price,
          original_price,
          description,
          fuel_type,
          transmission,
          year,
          features,
          image_url,
          referral_reward,
          friend_discount,
          is_active,
          is_popular,
          discount_amount,
          created_at
        FROM cars 
        WHERE is_active = TRUE
        ORDER BY is_popular DESC, created_at DESC
      `)

      console.log(`Found ${cars.length} cars in database`)
      return NextResponse.json({ cars, count: cars.length })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Get cars error:", error)
    return NextResponse.json(
      {
        error: "Database error",
        details: error.message,
        cars: [],
      },
      { status: 500 },
    )
  }
}
