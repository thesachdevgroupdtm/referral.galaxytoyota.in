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
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get user's referrals
      const [referrals] = await connection.execute(
        `
        SELECT 
          r.id,
          r.referee_name,
          r.referee_email,
          r.referee_phone,
          r.status,
          r.reward_amount,
          r.notes,
          r.created_at,
          r.updated_at,
          c.name as car_name,
          c.model as car_model
        FROM referrals r
        LEFT JOIN cars c ON r.car_id = c.id
        WHERE r.referrer_id = ?
        ORDER BY r.created_at DESC
      `,
        [userId],
      )

      return NextResponse.json({ referrals })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Get user referrals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
