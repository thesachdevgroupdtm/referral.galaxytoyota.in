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
    const { referrerId, refereeName, refereeEmail, refereePhone, carId, referralCode, message } = await request.json()

    if (!referrerId || !refereeName || !refereeEmail || !referralCode) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Check if referral already exists
      const [existingReferrals] = await connection.execute(
        "SELECT id FROM referrals WHERE referrer_id = ? AND referee_email = ?",
        [referrerId, refereeEmail],
      )

      if ((existingReferrals as any[]).length > 0) {
        return NextResponse.json({ error: "You have already referred this email address" }, { status: 409 })
      }

      // Get car details for reward calculation
      let rewardAmount = 10000 // default
      if (carId) {
        const [carRows] = await connection.execute(
          "SELECT referral_reward FROM cars WHERE id = ? AND is_active = TRUE",
          [carId],
        )

        if ((carRows as any[]).length > 0) {
          rewardAmount = (carRows as any[])[0].referral_reward
        }
      }

      // Insert referral
      const [result] = await connection.execute(
        `INSERT INTO referrals (
          referrer_id, referee_name, referee_email, referee_phone, 
          car_id, referral_code, status, reward_amount, notes, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, NOW(), NOW())`,
        [
          referrerId,
          refereeName,
          refereeEmail,
          refereePhone || null,
          carId || null,
          referralCode,
          rewardAmount,
          message || null,
        ],
      )

      const referralId = (result as any).insertId

      // Create notification for referrer
      await connection.execute(
        `INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
         VALUES (?, ?, ?, 'referral_update', NOW(), NOW())`,
        [referrerId, "Referral Sent!", `Your referral invitation has been sent to ${refereeName} (${refereeEmail})`],
      )

      return NextResponse.json({
        success: true,
        message: "Referral created successfully",
        referralId: referralId,
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Create referral error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
