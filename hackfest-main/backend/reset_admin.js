import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            admin.password = 'admin123'; // The new password you want
            await admin.save();
            console.log('✅ Admin password updated to: admin123');
        } else {
            console.log('❌ Admin user not found');
        }
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAdminPassword();