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
      const [notifications] = await connection.execute(
        `
        SELECT id, title, message, type, is_read, created_at
        FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 20
      `,
        [userId],
      )

      return NextResponse.json({ notifications })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, notificationId } = await request.json()

    if (!userId || !notificationId) {
      return NextResponse.json({ error: "User ID and notification ID are required" }, { status: 400 })
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      await connection.execute(
        `
        UPDATE notifications 
        SET is_read = TRUE 
        WHERE id = ? AND user_id = ?
      `,
        [notificationId, userId],
      )

      return NextResponse.json({ success: true })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
