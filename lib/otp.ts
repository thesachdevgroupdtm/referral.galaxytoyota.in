import { prisma } from "./prisma"
import { generateOTP } from "./utils"
import twilio from "twilio"
import nodemailer from "nodemailer"

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendPhoneOTP(userId: string, phone: string) {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.otpVerification.create({
    data: {
      userId,
      type: "PHONE",
      code: otp,
      expiresAt,
    },
  })

  try {
    await twilioClient.messages.create({
      body: `Your Galaxy Toyota verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    return { success: true }
  } catch (error) {
    console.error("SMS sending failed:", error)
    return { success: false, error: "Failed to send SMS" }
  }
}

export async function sendEmailOTP(userId: string, email: string) {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.otpVerification.create({
    data: {
      userId,
      type: "EMAIL",
      code: otp,
      expiresAt,
    },
  })

  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Galaxy Toyota - Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Galaxy Toyota</h2>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function verifyOTP(userId: string, code: string, type: "PHONE" | "EMAIL") {
  const otpRecord = await prisma.otpVerification.findFirst({
    where: {
      userId,
      code,
      type,
      verified: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!otpRecord) {
    return { success: false, error: "Invalid or expired OTP" }
  }

  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  })

  if (type === "PHONE") {
    await prisma.user.update({
      where: { id: userId },
      data: { phoneVerified: true },
    })
  }

  return { success: true }
}
