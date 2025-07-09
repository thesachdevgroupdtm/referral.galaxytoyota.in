import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import jwt from "jsonwebtoken"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const userId = decoded.userId

    // Create database connection
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get fresh user data from database
      const [users] = await connection.execute(
        `SELECT id, name, email, role, referral_code, total_referrals, total_earnings, available_balance, phone, city, state
         FROM users WHERE id = ?`,
        [userId],
      )

      if ((users as any[]).length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const user = (users as any[])[0]

      // Get recent referrals
      const [referrals] = await connection.execute(
        `SELECT id, referee_name, referee_email, status, created_at
         FROM referrals WHERE referrer_id = ? 
         ORDER BY created_at DESC LIMIT 5`,
        [userId],
      )

      // Get notifications
      const [notifications] = await connection.execute(
        `SELECT id, title, message, type, is_read, created_at
         FROM notifications WHERE user_id = ? 
         ORDER BY created_at DESC LIMIT 10`,
        [userId],
      )

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          referral_code: user.referral_code,
          total_referrals: user.total_referrals,
          total_earnings: Number.parseFloat(user.total_earnings || 0),
          available_balance: Number.parseFloat(user.available_balance || 0),
          phone: user.phone,
          city: user.city,
          state: user.state,
        },
        recent_referrals: referrals,
        notifications: notifications,
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
