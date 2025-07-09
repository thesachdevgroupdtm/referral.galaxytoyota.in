import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🔐 Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get user from database
      const [users] = await connection.execute(
        `SELECT id, name, email, password, role, referral_code, total_referrals, total_earnings, available_balance, is_active
         FROM users WHERE email = ? AND is_active = TRUE`,
        [email],
      )

      if ((users as any[]).length === 0) {
        console.log("❌ User not found or inactive:", email)
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      const user = (users as any[])[0]
      console.log("👤 User found:", user.email, "Role:", user.role)

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      console.log("🔑 Password validation:", isPasswordValid)

      if (!isPasswordValid) {
        console.log("❌ Invalid password for:", email)
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // Update last login (only if column exists)
      try {
        await connection.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])
        console.log("✅ Last login updated")
      } catch (error) {
        console.log("⚠️ Could not update last_login (column might not exist)")
      }

      // Create JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      )

      console.log("✅ Login successful for:", user.email, "Role:", user.role)

      // Create response
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          referral_code: user.referral_code,
          total_referrals: user.total_referrals,
          total_earnings: Number.parseFloat(user.total_earnings || "0"),
          available_balance: Number.parseFloat(user.available_balance || "0"),
        },
      })

      // Set HTTP-only cookie
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return response
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("💥 Login error:", error)
    return NextResponse.json(
      {
        error: "Login failed. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
