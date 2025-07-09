import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import mysql from "mysql2/promise"

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
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Create database connection
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get fresh user data
      const [users] = await connection.execute(
        "SELECT id, name, email, role, referral_code, total_referrals, total_earnings, available_balance FROM users WHERE id = ? AND is_active = TRUE",
        [decoded.userId],
      )

      const userRows = users as any[]

      if (userRows.length === 0) {
        return NextResponse.json({ user: null }, { status: 200 })
      }

      const user = userRows[0]

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          referral_code: user.referral_code,
          total_referrals: user.total_referrals,
          total_earnings: user.total_earnings,
          available_balance: user.available_balance,
        },
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
