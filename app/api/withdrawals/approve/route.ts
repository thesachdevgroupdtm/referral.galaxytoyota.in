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
    const { withdrawalId, status } = await request.json()

    if (!withdrawalId || !status) {
      return NextResponse.json({ error: "Withdrawal ID and status are required" }, { status: 400 })
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get withdrawal details
      const [withdrawalResult] = await connection.execute(
        `
        SELECT wr.user_id, wr.amount, u.available_balance, u.name
        FROM withdrawal_requests wr
        JOIN users u ON wr.user_id = u.id
        WHERE wr.id = ? AND wr.status = 'pending'
      `,
        [withdrawalId],
      )

      const withdrawal = (withdrawalResult as any[])[0]
      if (!withdrawal) {
        return NextResponse.json({ error: "Withdrawal request not found or already processed" }, { status: 404 })
      }

      // Update withdrawal status
      await connection.execute(
        `
        UPDATE withdrawal_requests 
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [status, withdrawalId],
      )

      if (status === "approved") {
        // Deduct amount from user's available balance
        await connection.execute(
          `
          UPDATE users 
          SET available_balance = available_balance - ?
          WHERE id = ?
        `,
          [withdrawal.amount, withdrawal.user_id],
        )

        // Create notification for user
        await connection.execute(
          `
          INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
          VALUES (?, ?, ?, 'withdrawal_approved', NOW(), NOW())
        `,
          [
            withdrawal.user_id,
            "Withdrawal Approved! 💰",
            `Your withdrawal request for ₹${withdrawal.amount.toLocaleString()} has been approved. The amount will be transferred to your account within 3-5 business days.`,
          ],
        )
      } else {
        // Create notification for rejection
        await connection.execute(
          `
          INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
          VALUES (?, ?, ?, 'withdrawal_rejected', NOW(), NOW())
        `,
          [
            withdrawal.user_id,
            "Withdrawal Request Rejected",
            `Your withdrawal request for ₹${withdrawal.amount.toLocaleString()} has been rejected. Please contact support for more information.`,
          ],
        )
      }

      return NextResponse.json({
        success: true,
        message: `Withdrawal request ${status} successfully`,
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Approve withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
