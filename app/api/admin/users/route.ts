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
      // Get all users with their referral stats
      const [users] = await connection.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.referral_code,
          u.phone,
          u.is_active,
          u.created_at,
          COALESCE(r.total_referrals, 0) as total_referrals,
          COALESCE(r.completed_referrals, 0) as completed_referrals,
          COALESCE(r.total_earnings, 0) as total_earnings
        FROM users u
        LEFT JOIN (
          SELECT 
            referrer_id,
            COUNT(*) as total_referrals,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
            SUM(CASE WHEN status = 'completed' THEN reward_amount ELSE 0 END) as total_earnings
          FROM referrals 
          GROUP BY referrer_id
        ) r ON u.id = r.referrer_id
        ORDER BY u.created_at DESC
      `)

      return NextResponse.json({ users })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
