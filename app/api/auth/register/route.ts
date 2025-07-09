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

function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase()
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${suffix}`
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, referralCode } = await request.json()

    // Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute("SELECT id FROM users WHERE email = ?", [email])

      if ((existingUsers as any[]).length > 0) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Generate unique referral code
      let userReferralCode = generateReferralCode(name)
      let codeExists = true
      let attempts = 0

      while (codeExists && attempts < 10) {
        const [codes] = await connection.execute("SELECT id FROM users WHERE referral_code = ?", [userReferralCode])
        if ((codes as any[]).length === 0) {
          codeExists = false
        } else {
          userReferralCode = generateReferralCode(name)
          attempts++
        }
      }

      // Validate referral code if provided
      let referrerId = null
      if (referralCode && referralCode.trim()) {
        const [referrers] = await connection.execute("SELECT id FROM users WHERE referral_code = ?", [
          referralCode.trim(),
        ])
        if ((referrers as any[]).length > 0) {
          referrerId = (referrers as any[])[0].id
        }
      }

      // Insert new user
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, phone, password, referral_code, referred_by, role, email_verified, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, 'USER', TRUE, TRUE, NOW(), NOW())`,
        [name, email, phone, hashedPassword, userReferralCode, referrerId],
      )

      const userId = (result as any).insertId

      // If user was referred, create referral record and update referrer
      if (referrerId) {
        // Create referral record (without car_id)
        await connection.execute(
          `INSERT INTO referrals (referrer_id, referee_id, referral_code, status, reward_amount, created_at, updated_at)
           VALUES (?, ?, ?, 'PENDING', 10000.00, NOW(), NOW())`,
          [referrerId, userId, referralCode.trim()],
        )

        // Update referrer's stats
        await connection.execute(
          `UPDATE users SET 
           total_referrals = total_referrals + 1,
           total_earnings = total_earnings + 10000.00,
           available_balance = available_balance + 10000.00,
           updated_at = NOW()
           WHERE id = ?`,
          [referrerId],
        )

        // Create notification for referrer
        await connection.execute(
          `INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
           VALUES (?, 'New Referral!', ?, 'REFERRAL', FALSE, NOW())`,
          [referrerId, `You earned ₹10,000 for referring ${name}!`],
        )

        // Create reward record
        await connection.execute(
          `INSERT INTO rewards (user_id, type, amount, description, status, created_at, updated_at)
           VALUES (?, 'REFERRAL_BONUS', 10000.00, ?, 'COMPLETED', NOW(), NOW())`,
          [referrerId, `Referral bonus for ${name}`],
        )
      }

      // Get the created user
      const [users] = await connection.execute(
        `SELECT id, name, email, role, referral_code, total_referrals, total_earnings, available_balance
         FROM users WHERE id = ?`,
        [userId],
      )

      const user = (users as any[])[0]

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

      // Create response
      const response = NextResponse.json({
        success: true,
        message: "Registration successful! Welcome to Galaxy Toyota Referral Program.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          referral_code: user.referral_code,
          total_referrals: user.total_referrals,
          total_earnings: Number.parseFloat(user.total_earnings),
          available_balance: Number.parseFloat(user.available_balance),
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
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
