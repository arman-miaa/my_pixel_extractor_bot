"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const seedAdmin = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log('🌱 Connected to Database for Seeding...');
        const superAdminExists = await user_model_1.User.findOne({ role: 'super_admin' });
        if (!superAdminExists) {
            await user_model_1.User.create({
                telegramId: '111222333',
                username: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                role: 'super_admin',
                mainBalance: 1000,
                referralBalance: 100,
            });
            console.log('✅ Super Admin created successfully!');
        }
        else {
            console.log('ℹ️ Super Admin already exists.');
        }
    }
    catch (error) {
        console.error('❌ Error seeding super admin:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
if (require.main === module) {
    seedAdmin();
}
exports.default = seedAdmin;
