import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
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
  },

  trustedOrigins: [
    `http://localhost:${config.portFrontend}`,
    config.nodeEnv === "production" ? "https://backupstorage.com" : null,
  ].filter(Boolean) as string[],

  session: {
    expiresIn: 60 * 2, // Total session lifetime (2 minutes)
    updateAge: 60, // Refresh session if user is active after 1 min
    cookieCache: {
      enabled: true, // Cache session in cookies for faster auth
      maxAge: 60 * 2, // Cookie cache lifetime (2 minutes)
    },
  },

  advanced: {
    generateId: false, // Let MySQL auto-increment handle IDs
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
        input: false, // Not settable by user
      },
    },
  },
});

export type Auth = typeof auth;
