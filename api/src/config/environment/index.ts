import { configUtil } from 'utils';
import * as process from 'process';

const env = process.env.APP_ENV || 'development';

const base = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
  appCookieKey: process.env.APP_COOKIE_KEY || 'development-key',
  mongo: {
    connection: process.env.MONGO_CONNECTION || '',
    dbName: '',
  },
  cloudStorage: {
    bucket: '',
    endpoint: '',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID || '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    redirectUri: process.env.GMAIL_REDIRECT_URI || '',
  },
  subscriptions: {
    starter: process.env.STARTER_SUBSCRIPTION_ID,
    pro: process.env.PRO_SUBSCRIPTION_ID,
  },
  apiUrl: '',
  webUrl: '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  redis: 'redis://:@redis:6379',
  adminKey: '',
  MAGIC_SECRET_KEY: process.env.MAGIC_SECRET_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  mailerliteSecret: process.env.MAILERLITE_SECRET || '',
  STRIPE_API_KEY: process.env.STRIPE_API_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  MONTHLY_ACTIVE_USERS_LIMIT: process.env.MONTHLY_ACTIVE_USERS_LIMIT || 2000,
  MONTHLY_EMAILS_LIMIT: process.env.MONTHLY_EMAILS_LIMIT || 15000,
  PIPELINES_LIMIT: process.env.PIPELINES_LIMIT || 3,
  USERS_LIMIT: process.env.USERS_LIMIT || 3,
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY || '',
  mainApplicationId: process.env.MAIN_APPLICATION_ID || '',
};

const config = configUtil.loadConfig(base, env, __dirname);

export default config;
