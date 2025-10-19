# Email Reminder System Setup Guide

## Overview
The email reminder system automatically sends daily email notifications to users about bills, subscriptions, and debts that are due today.

## Features
- ✅ Daily automated email reminders at 9:00 AM IST
- ✅ Beautiful HTML email templates with Kuber branding
- ✅ User-configurable email reminder settings
- ✅ Support for bills, subscriptions, and debts
- ✅ Manual trigger for testing
- ✅ Respects user email preferences

## Setup Instructions

### 1. Email Service Configuration

#### Option A: Gmail (Recommended for Development)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Add to your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:3000
```

#### Option B: Production Email Service
For production, consider using:
- **SendGrid**: Professional email service with high deliverability
- **AWS SES**: Amazon's email service
- **Mailgun**: Developer-friendly email API
- **Nodemailer with SMTP**: Any SMTP provider

Update the `createTransporter()` function in `src/services/emailService.js` accordingly.

### 2. Environment Variables
Add these to your `.env` file:
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000

# Optional: Test email for testing
TEST_EMAIL=test@example.com
```

### 3. Testing the Email System

#### Test Email Sending
```bash
# Run the test script
node test-email.js
```

#### Test Manual Reminder Trigger
```bash
# Start the server
npm run dev

# In another terminal, trigger reminders manually
curl -X POST http://localhost:5000/api/reminders/send-reminders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. How It Works

#### Daily Schedule
- Runs every day at 9:00 AM IST (configurable)
- Checks all users with email reminders enabled
- Sends individual emails for each due payment

#### Email Types
1. **Bill Reminders**: For bills with `dueDate` matching today
2. **Subscription Reminders**: For subscriptions with `nextDue` matching today  
3. **Debt Reminders**: For debts with `due` matching today

#### User Settings
Users can control email reminders in Settings:
- Enable/disable email reminders
- Set preferred reminder time
- Settings are stored in the `Settings` model

### 5. Email Templates

The system includes beautiful HTML email templates with:
- Kuber branding and gradient design
- Payment details (name, amount, due date)
- Direct links to relevant dashboard pages
- Responsive design for mobile devices

### 6. API Endpoints

#### Get Email Settings
```http
GET /api/settings/email-reminders
Authorization: Bearer <token>
```

#### Update Email Settings
```http
PUT /api/settings/email-reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailReminders": true,
  "reminderTime": "09:00"
}
```

#### Manual Trigger (Testing)
```http
POST /api/reminders/send-reminders
Authorization: Bearer <token>
```

### 7. Database Schema

#### Settings Model (Updated)
```javascript
{
  userId: ObjectId,
  theme: String,
  currency: String,
  monthlyBudget: Number,
  emailReminders: Boolean, // NEW
  reminderTime: String,    // NEW (format: "HH:MM")
  timestamps: true
}
```

### 8. Troubleshooting

#### Common Issues

1. **"Invalid login" error**
   - Check if 2FA is enabled on Gmail
   - Verify app password is correct
   - Ensure EMAIL_USER is your full Gmail address

2. **Emails not sending**
   - Check server logs for error messages
   - Verify EMAIL_PASS is the app password, not your regular password
   - Test with the test script first

3. **Scheduled job not running**
   - Check server logs for cron job messages
   - Verify timezone settings in scheduler.js
   - Ensure server is running continuously

4. **Users not receiving emails**
   - Check if email reminders are enabled in user settings
   - Verify user email addresses are valid
   - Check spam folders

#### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

This will run test reminders immediately on server start.

### 9. Production Considerations

1. **Email Service**: Use a professional email service (SendGrid, AWS SES)
2. **Rate Limiting**: Implement rate limiting for email sending
3. **Error Handling**: Add retry logic for failed emails
4. **Monitoring**: Set up email delivery monitoring
5. **Compliance**: Ensure GDPR/privacy compliance for email data

### 10. Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using email service APIs instead of SMTP for better security
- Implement proper error handling to avoid exposing sensitive information

## Support

For issues or questions about the email reminder system, check:
1. Server logs for error messages
2. Email service provider documentation
3. Nodemailer documentation for SMTP configuration
