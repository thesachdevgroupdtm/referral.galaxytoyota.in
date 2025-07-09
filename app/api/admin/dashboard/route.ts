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
      // Get dashboard statistics
      const [statsResult] = await connection.execute(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role != 'ADMIN' AND role != 'SUPERADMIN') as total_users,
          (SELECT COUNT(*) FROM referrals) as total_referrals,
          (SELECT COUNT(*) FROM referrals WHERE status = 'completed') as completed_referrals,
          (SELECT COUNT(*) FROM cars WHERE is_active = TRUE) as total_cars,
          (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE status = 'completed') as total_rewards_paid
      `)

      const stats = (statsResult as any[])[0]

      // Get recent referrals with user details
      const [recentReferrals] = await connection.execute(`
        SELECT 
          r.id,
          r.referee_name,
          r.referee_email,
          r.status,
          r.reward_amount,
          r.created_at,
          u.name as referrer_name,
          u.email as referrer_email
        FROM referrals r
        JOIN users u ON r.referrer_id = u.id
        ORDER BY r.created_at DESC
        LIMIT 20
      `)

      // Get top referrers
      const [topReferrers] = await connection.execute(`
        SELECT 
          u.name,
          u.email,
          u.referral_code,
          COUNT(r.id) as referral_count,
          SUM(CASE WHEN r.status = 'completed' THEN r.reward_amount ELSE 0 END) as total_earnings
        FROM users u
        LEFT JOIN referrals r ON u.id = r.referrer_id
        WHERE u.role != 'ADMIN' AND u.role != 'SUPERADMIN'
        GROUP BY u.id, u.name, u.email, u.referral_code
        HAVING referral_count > 0
        ORDER BY referral_count DESC, total_earnings DESC
        LIMIT 10
      `)

      return NextResponse.json({
        stats,
        recentReferrals,
        topReferrers,
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
