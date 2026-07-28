import mongoose from 'mongoose';
import config from '../config';
import { User } from '../modules/user/user.model';

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.database_url);
    console.log('🌱 Connected to Database for Seeding...');

    const superAdminExists = await User.findOne({ role: 'super_admin' });
    if (!superAdminExists) {
      await User.create({
        telegramId: '111222333',
        username: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        mainBalance: 1000,
        referralBalance: 100,
      });
      console.log('✅ Super Admin created successfully!');
    } else {
      console.log('ℹ️ Super Admin already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedAdmin();
}

export default seedAdmin;
