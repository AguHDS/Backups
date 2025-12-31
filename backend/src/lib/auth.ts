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
    expiresIn: 60 * 60 * 24 * 30, // 30 días (sesiones más largas para mejor UX)
    updateAge: 60 * 60 * 24, // Actualizar sesión cada 24h de actividad
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 24 horas de caché en cookies
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
        input: false, // Not settable by user
      },
    },
  },
});

export type Auth = typeof auth;
