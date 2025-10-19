import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './src/config/db.js';
import { Subscription, Settings } from './src/models/FinanceModels.js';
import User from './src/models/User.js';
import { sendReminderEmails } from './src/services/emailService.js';

async function testSpotifyReminder() {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Database connected');

    // Find your user
    const user = await User.findOne({ email: 'abhisheksinghaniagca@gmail.com' });
    if (!user) {
      console.log('❌ User not found. Creating test user...');
      // Create a test user
      const newUser = await User.create({
        name: 'Abhishek Singh',
        email: 'abhisheksinghaniagca@gmail.com',
        password: 'test123' // This won't be used for email testing
      });
      console.log('✅ Created test user');
    }

    const currentUser = await User.findOne({ email: 'abhisheksinghaniagca@gmail.com' });
    console.log(`👤 Testing with user: ${currentUser.name} (${currentUser.email})`);

    // Ensure email reminders are enabled
    let userSettings = await Settings.findOne({ userId: currentUser._id });
    if (!userSettings) {
      userSettings = await Settings.create({
        userId: currentUser._id,
        emailReminders: true,
        reminderTime: '09:00'
      });
      console.log('✅ Created user settings with email reminders enabled');
    } else {
      userSettings.emailReminders = true;
      await userSettings.save();
      console.log('✅ Enabled email reminders for user');
    }

    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Today's date: ${today}`);

    // Create Spotify subscription due today (exactly like you did)
    const spotifySubscription = await Subscription.create({
      userId: currentUser._id,
      name: 'Spotify Premium',
      amount: 199,
      nextDue: today,
      cycle: 'monthly'
    });
    console.log(`✅ Created Spotify subscription: ${spotifySubscription.name} - ₹${spotifySubscription.amount} due ${spotifySubscription.nextDue}`);

    console.log('\n📧 Running email reminder check...');
    await sendReminderEmails();

    console.log('\n✅ Test completed!');
    console.log(`📬 Check ${currentUser.email} inbox for Spotify reminder email`);
    console.log('📧 Subject should be: "🔄 Subscription Renewal: Spotify Premium - Due Today"');

    // Keep the subscription for you to test manually
    console.log('\n💡 The Spotify subscription is now in your database.');
    console.log('You can test the scheduled job by waiting for the next minute or manually triggering it.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run test
testSpotifyReminder().catch(console.error);
