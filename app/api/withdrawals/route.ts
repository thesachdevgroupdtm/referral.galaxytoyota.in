import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "galaxy_toyota_referral",
}

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json()

    if (!userId || !amount) {
      return NextResponse.json({ error: "User ID and amount are required" }, { status: 400 })
    }

    if (amount < 1000) {
      return NextResponse.json({ error: "Minimum withdrawal amount is ₹1,000" }, { status: 400 })
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Check user's available balance
      const [userResult] = await connection.execute(`SELECT available_balance, name, email FROM users WHERE id = ?`, [
        userId,
      ])

      const user = (userResult as any[])[0]
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      if (user.available_balance < amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
      }

      // Check if user has pending withdrawal request
      const [pendingResult] = await connection.execute(
        `SELECT id FROM withdrawal_requests WHERE user_id = ? AND status = 'pending'`,
        [userId],
      )

      if ((pendingResult as any[]).length > 0) {
        return NextResponse.json({ error: "You already have a pending withdrawal request" }, { status: 400 })
      }

      // Create withdrawal request
      await connection.execute(
        `
        INSERT INTO withdrawal_requests (user_id, amount, status, created_at, updated_at)
        VALUES (?, ?, 'pending', NOW(), NOW())
      `,
        [userId, amount],
      )

      // Create notification for user
      await connection.execute(
        `
        INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
        VALUES (?, ?, ?, 'withdrawal_request', NOW(), NOW())
      `,
        [
          userId,
          "Withdrawal Request Submitted",
          `Your withdrawal request for ₹${amount.toLocaleString()} has been submitted and is pending approval.`,
        ],
      )

      return NextResponse.json({ success: true, message: "Withdrawal request submitted successfully" })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Create withdrawal request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const connection = await mysql.createConnection(dbConfig)

    try {
      let query = `
        SELECT 
          wr.id,
          wr.amount,
          wr.status,
          wr.created_at,
          wr.updated_at,
          u.name as user_name,
          u.email as user_email
        FROM withdrawal_requests wr
        JOIN users u ON wr.user_id = u.id
      `
      const params: any[] = []

      if (userId) {
        query += ` WHERE wr.user_id = ?`
        params.push(userId)
      }

      query += ` ORDER BY wr.created_at DESC`

      const [withdrawals] = await connection.execute(query, params)

      return NextResponse.json({ withdrawals })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Get withdrawals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
