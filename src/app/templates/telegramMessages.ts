import { IUser } from '../modules/user/user.interface';

export const buildProfileMessage = (user: IUser, queueCount = 168): string => {
  const name = user.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : (user.username || 'User');
  const recentTasksText = user.recentTasks && user.recentTasks.length > 0
    ? user.recentTasks.map(t => `• ${t.title}: ${t.status}`).join('\n')
    : '• No recent tasks found';

  return `👤 *My Profile*
• *Telegram ID:* \`${user.telegramId}\`
• *Name:* ${name}

📊 *Statistics & Balance:*
• *Main Balance:* ${user.mainBalance} points
• *Referral Balance:* ${user.referralBalance.toFixed(2)} points
• *Total Success:* ${user.totalSuccess}
• *Success Today:* ${user.successToday}
• *In Progress:* ${user.inProgressCount}
• *Cost per Extract:* ${user.costPerExtract} point
• *Global Server Queue:* ${queueCount} orders

📋 *Recent Tasks:*
${recentTasksText}`;
};

export const buildReferralMessage = (user: IUser, botUsername: string): string => {
  const referralLink = `https://t.me/${botUsername}?start=ref_${user.telegramId}`;
  return `📊 *Your Statistics:*
• *Eligible:* ${user.eligibleReferrals || 0} Users
• *Not Eligible:* ${user.notEligibleReferrals || 0} Users
• *Pending:* ${user.pendingReferrals || 0} Users

💰 *Main Balance:* ${user.mainBalance} Points
💳 *Referral Balance:* ${user.referralBalance.toFixed(2)} Points

🔗 *Your Referral Link:*
\`${referralLink}\`

Share this link with your friends to earn points!`;
};
