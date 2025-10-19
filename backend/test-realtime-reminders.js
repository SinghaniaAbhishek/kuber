import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './src/config/db.js';
import { Bill, Subscription, Debt, Settings } from './src/models/FinanceModels.js';
import User from './src/models/User.js';
import { sendReminderEmails } from './src/services/emailService.js';

async function testRealtimeReminders() {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Database connected');

    // Find a user to test with
    const user = await User.findOne({});
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`👤 Testing with user: ${user.name} (${user.email})`);

    // Check if user has email reminders enabled
    let userSettings = await Settings.findOne({ userId: user._id });
    if (!userSettings) {
      userSettings = await Settings.create({
        userId: user._id,
        emailReminders: true,
        reminderTime: '09:00'
      });
      console.log('✅ Created user settings with email reminders enabled');
    } else {
      // Enable email reminders if disabled
      if (!userSettings.emailReminders) {
        userSettings.emailReminders = true;
        await userSettings.save();
        console.log('✅ Enabled email reminders for user');
      }
    }

    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Today's date: ${today}`);

    // Create a test bill due today
    const testBill = await Bill.create({
      userId: user._id,
      name: 'Test Internet Bill',
      amount: 1200,
      dueDate: today,
      recurring: 'monthly'
    });
    console.log(`✅ Created test bill: ${testBill.name} - ₹${testBill.amount} due ${testBill.dueDate}`);

    // Create a test subscription due today
    const testSubscription = await Subscription.create({
      userId: user._id,
      name: 'Netflix Subscription',
      amount: 499,
      nextDue: today,
      cycle: 'monthly'
    });
    console.log(`✅ Created test subscription: ${testSubscription.name} - ₹${testSubscription.amount} due ${testSubscription.nextDue}`);

    // Create a test debt due today
    const testDebt = await Debt.create({
      userId: user._id,
      name: 'Credit Card Payment',
      amount: 5000,
      type: 'credit_card',
      due: today,
      note: 'Monthly minimum payment'
    });
    console.log(`✅ Created test debt: ${testDebt.name} - ₹${testDebt.amount} due ${testDebt.due}`);

    console.log('\n📧 Running email reminder check...');
    await sendReminderEmails();

    console.log('\n✅ Test completed! Check the email inbox for reminders.');
    console.log(`📬 Email should be sent to: ${user.email}`);

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await Bill.deleteOne({ _id: testBill._id });
    await Subscription.deleteOne({ _id: testSubscription._id });
    await Debt.deleteOne({ _id: testDebt._id });
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run test
testRealtimeReminders().catch(console.error);
