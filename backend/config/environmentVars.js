const requiredVariables = [
  "PORT_FRONTEND",
  "PORT_BACKEND",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "NODE_ENV",
  "DB_HOST",
  "DB_DATABASE",
  "DB_USER",
];

const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if(missingVariables.length > 0) throw new Error(`Missing environment variables: ${missingVariables.join(", ")}`);

const config = {
    portFrontend: process.env.PORT_FRONTEND,
    portBackend: process.env.PORT_BACKEND,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    nodeEnv: process.env.NODE_ENV,
    dbHost: process.env.DB_HOST,
    dbDatabase: process.env.DB_DATABASE,
    dbUser: process.env.DB_USER,
}

export default config;