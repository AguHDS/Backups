import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";
import config from "@/infraestructure/config/environmentVars.js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url, token }) => {
      console.log(`📧 Password reset email for: ${user.email}`);
      console.log(`🔗 BetterAuth URL: ${url}`);
      console.log(`🔐 Token: ${token}`);

      const frontendBaseUrl =
        process.env.FRONTEND_URL || `http://localhost:${config.portFrontend}`;
      const frontendUrl = `${frontendBaseUrl}/reset-password?token=${token}`;

      console.log(`🎯 Frontend URL (para tu app): ${frontendUrl}`);

      // Show both links for development purposes
      if (config.nodeEnv !== "production") {
        console.log(`BetterAuth URL: ${url}`);
      }

      // IMPORTANT: BetterAuth manages the sending automatically
      // DO NOT return anything - only log for development
      // BetterAuth will use the SMTP configuration of the 'email' object if it is configured

      // In development: We can show the link but NOT send real email
      // In production: BetterAuth will automatically send the email using the URL you generated
    },

    onPasswordReset: async ({ user }) => {
      console.log(`Password reset completed for user: ${user.email}`);
    },
  },

  email: {
    from: "Backups <noreply@backups.com>",
    server: {
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER || "test@ethereal.email",
        pass: process.env.SMTP_PASSWORD || "test123",
      },
    },
  },

  trustedOrigins: [
    `http://localhost:${config.portFrontend}`,
    config.nodeEnv === "production" ? "https://backupstorage.com" : null,
  ].filter(Boolean) as string[],

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },

  advanced: {
    useSecureCookies: config.nodeEnv === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },

  plugins: [
    admin({
      adminRoles: ["admin"],
      defaultRole: "user",
    }),
  ],
});

export type Auth = typeof auth;
