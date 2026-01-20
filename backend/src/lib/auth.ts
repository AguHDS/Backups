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

      // Log adicional para debugging del envío real
      console.log(`📤 Email será enviado por BetterAuth usando:`);
      console.log(
        `   - SMTP Host: ${process.env.SMTP_HOST || "No configurado"}`,
      );
      console.log(
        `   - From: ${process.env.SMTP_FROM_EMAIL || "No configurado"}`,
      );

      // IMPORTANT: NO retornes nada - BetterAuth maneja el envío automáticamente
      // La configuración SMTP en el objeto 'email' será usada automáticamente
    },

    onPasswordReset: async ({ user }) => {
      console.log(`✅ Password reset completed for user: ${user.email}`);
    },
  },

  email: {
    // Usa las variables de entorno directamente
    from: process.env.SMTP_FROM_EMAIL
      ? `Backups <${process.env.SMTP_FROM_EMAIL}>`
      : "Backups <noreply@backups.com>",

    server: {
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // 587 usa STARTTLS, no SSL directo
      auth: {
        user: process.env.SMTP_USER || "test@ethereal.email",
        pass: process.env.SMTP_PASSWORD || "test123",
      },
    },

    // Configuración adicional para mejor deliverability
    tls: {
      rejectUnauthorized: false, // Útil para desarrollo/auto-signed certs
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
