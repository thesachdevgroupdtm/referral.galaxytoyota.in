# Galaxy Toyota Referral Program

A comprehensive car referral program web application built with Next.js, featuring user management, referral tracking, and reward systems.

## 🚀 Features

### User Management
- **Multi-role System**: Super Admin, Admin, and User roles
- **Secure Authentication**: Email/password login with bcrypt encryption
- **Social Login**: Google and GitHub integration ready
- **User Registration**: With referral code support

### Referral System
- **Unique Referral Codes**: Auto-generated for each user
- **Multi-channel Sharing**: Email, SMS, and social media
- **Referral Tracking**: Complete lifecycle from invitation to purchase
- **Reward Calculation**: Automatic reward processing

### Car Management
- **Car Listings**: Browse Toyota vehicles with detailed specs
- **Dynamic Pricing**: Support for discounts and promotions
- **Image Gallery**: Multiple images per vehicle
- **Feature Highlights**: Key selling points and specifications

### Admin Panel
- **Super Admin Dashboard**: Complete system oversight
- **User Management**: View, edit, and manage all users
- **Referral Monitoring**: Track all referral activities
- **Reward Management**: Process and approve rewards
- **Analytics**: Performance metrics and reporting

### Mobile-Friendly Design
- **Responsive Layout**: Works on all device sizes
- **Touch-Optimized**: Mobile-first design approach
- **Fast Loading**: Optimized for mobile networks
- **Progressive Web App**: PWA capabilities

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Database**: MySQL with connection pooling
- **Authentication**: Custom JWT implementation
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Lucide React
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🚀 Quick Setup

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd galaxy-toyota-referral
npm install
\`\`\`

### 2. Database Setup
\`\`\`bash
# Run the automated setup
node scripts/setup-database.js
\`\`\`

### 3. Environment Configuration
Copy `.env.local` and update with your database credentials:
\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=galaxy_toyota_referral
DB_USERNAME=root
DB_PASSWORD=your_password
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## 🔐 Default Login Credentials

- **Super Admin**: superadmin@galaxytoyota.com / password
- **Admin**: admin@galaxytoyota.com / password
- **User**: john@example.com / password

## 📱 Mobile Features

- **Responsive Design**: Optimized for all screen sizes
- **Touch Navigation**: Mobile-friendly interface
- **Fast Loading**: Optimized images and code splitting
- **Offline Support**: Basic PWA functionality

## 🎯 User Roles & Permissions

### Super Admin
- Full system access
- User management (create, edit, delete)
- System configuration
- Analytics and reporting

### Admin  
- User management (view, edit)
- Referral management
- Car inventory management
- Reward processing

### User
- Personal dashboard
- Referral creation and tracking
- Reward history
- Profile management

## 💰 Reward System

- **Default Referral Reward**: ₹10,000
- **Friend Discount**: ₹5,000
- **Tier-based Rewards**: Bronze, Silver, Gold, Platinum
- **Multiple Reward Types**: Cash, points, vouchers

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Referrals
- `POST /api/referrals/create` - Create new referral
- `GET /api/referrals/user/:id` - Get user referrals
- `PUT /api/referrals/:id/status` - Update referral status

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Create new car (Admin)

## 🚀 Deployment

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Variables for Production
\`\`\`env
NODE_ENV=production
APP_URL=https://yourdomain.com
DB_HOST=your-production-db-host
# ... other production configs
\`\`\`

## 📊 Database Schema

### Key Tables
- **users**: User accounts and profiles
- **cars**: Vehicle inventory
- **referrals**: Referral tracking
- **rewards**: Reward management
- **notifications**: User notifications

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: API endpoint protection

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Database Indexing**: Optimized query performance
- **Caching**: Static and dynamic content caching

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service is running
   - Verify credentials in `.env.local`
   - Ensure database exists

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Port Already in Use**
   - Change port: `npm run dev -- -p 3001`
   - Kill existing process: `lsof -ti:3000 | xargs kill`

## 📞 Support

For technical support or questions:
- Email: support@galaxytoyota.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## 📄 License

This project is proprietary software. All rights reserved.

---

**Galaxy Toyota Referral Program** - Connecting people with their perfect Toyota vehicle! 🚗✨
