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
    const { referralId, status } = await request.json()

    if (!referralId || !status) {
      return NextResponse.json({ error: "Referral ID and status are required" }, { status: 400 })
    }

    if (!["completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Get referral details
      const [referralRows] = await connection.execute("SELECT * FROM referrals WHERE id = ?", [referralId])

      if ((referralRows as any[]).length === 0) {
        return NextResponse.json({ error: "Referral not found" }, { status: 404 })
      }

      const referral = (referralRows as any[])[0]

      // Update referral status
      await connection.execute("UPDATE referrals SET status = ?, updated_at = NOW() WHERE id = ?", [status, referralId])

      // Update user earnings if approved
      if (status === "completed") {
        await connection.execute(
          `UPDATE users SET 
           total_earnings = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = ? AND status = 'completed'),
           available_balance = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = ? AND status = 'completed')
           WHERE id = ?`,
          [referral.referrer_id, referral.referrer_id, referral.referrer_id],
        )

        // Create notification for user
        await connection.execute(
          `INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
           VALUES (?, ?, ?, 'referral_update', NOW(), NOW())`,
          [
            referral.referrer_id,
            "Referral Approved!",
            `Your referral for ${referral.referee_name} has been approved. ₹${referral.reward_amount} has been added to your balance.`,
          ],
        )
      } else {
        // Create notification for rejection
        await connection.execute(
          `INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
           VALUES (?, ?, ?, 'referral_update', NOW(), NOW())`,
          [referral.referrer_id, "Referral Update", `Your referral for ${referral.referee_name} has been ${status}.`],
        )
      }

      return NextResponse.json({
        success: true,
        message: `Referral ${status} successfully`,
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Approve referral error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
