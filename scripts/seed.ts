import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { generateReferralCode } from "../lib/utils"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create settings
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      referralRewardAmount: 10000,
      refereeDiscountAmount: 5000,
      minWithdrawalAmount: 1000,
      maxReferralsPerDay: 10,
      otpExpiryMinutes: 10,
    },
  })

  // Create SuperAdmin
  const superAdminPassword = await bcrypt.hash("password", 12)
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@galaxytoyota.com" },
    update: {},
    create: {
      email: "superadmin@galaxytoyota.com",
      name: "Super Admin",
      password: superAdminPassword,
      role: "SUPERADMIN",
      referralCode: "GALAXY-SUPER",
      emailVerified: new Date(),
    },
  })

  // Create Admin
  const adminPassword = await bcrypt.hash("password", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@galaxytoyota.com" },
    update: {},
    create: {
      email: "admin@galaxytoyota.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      referralCode: "GALAXY-ADMIN",
      emailVerified: new Date(),
    },
  })

  // Create sample users
  const userPassword = await bcrypt.hash("password", 12)
  const users = []

  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: userPassword,
        role: "USER",
        referralCode: generateReferralCode(),
        phone: `+91900000000${i}`,
        emailVerified: new Date(),
      },
    })
    users.push(user)
  }

  // Create cars
  const cars = [
    {
      name: "Toyota Camry",
      model: "2024",
      year: 2024,
      price: 4200000,
      description: "Premium sedan with advanced features",
      features: {
        engine: "2.5L Hybrid",
        transmission: "CVT",
        fuelType: "Hybrid",
        seating: 5,
        safety: "5-Star Rating",
      },
    },
    {
      name: "Toyota Fortuner",
      model: "2024",
      year: 2024,
      price: 3500000,
      description: "Powerful SUV for all terrains",
      features: {
        engine: "2.8L Diesel",
        transmission: "Automatic",
        fuelType: "Diesel",
        seating: 7,
        driveType: "4WD",
      },
    },
    {
      name: "Toyota Innova Crysta",
      model: "2024",
      year: 2024,
      price: 2000000,
      description: "Spacious MPV for families",
      features: {
        engine: "2.4L Diesel",
        transmission: "Manual/Automatic",
        fuelType: "Diesel",
        seating: 8,
        comfort: "Premium Interior",
      },
    },
  ]

  for (const carData of cars) {
    await prisma.car.create({ data: carData })
  }

  // Create sample referrals
  const createdCars = await prisma.car.findMany()

  for (let i = 0; i < 10; i++) {
    const referrer = users[Math.floor(Math.random() * users.length)]
    const car = createdCars[Math.floor(Math.random() * createdCars.length)]

    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeName: `Referred Person ${i + 1}`,
        refereeEmail: `referred${i + 1}@example.com`,
        refereePhone: `+91800000000${i}`,
        carId: car.id,
        status: ["PENDING", "CONTACTED", "COMPLETED"][Math.floor(Math.random() * 3)] as any,
        rewardAmount: Math.random() > 0.5 ? 10000 : 0,
      },
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log("🔑 Login credentials:")
  console.log("SuperAdmin: superadmin@galaxytoyota.com / password")
  console.log("Admin: admin@galaxytoyota.com / password")
  console.log("Users: user1@example.com to user5@example.com / password")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
