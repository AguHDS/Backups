interface Config {
  portFrontend: string;
  portBackend: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  nodeEnv: string;
  dbHost: string;
  dbDatabase: string;
  dbUser: string;
  dbPassword: string;
}

const requiredVariables = [
  "PORT_FRONTEND",
  "PORT_BACKEND",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "NODE_ENV",
  "DB_HOST",
  "DB_DATABASE",
  "DB_USER",
  "DB_PASSWORD",
] as const;

const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if(missingVariables.length > 0) throw new Error(`Missing environment variables: ${missingVariables.join(", ")}`);

//guarantee that all required variables are not undefined
const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const config: Config = {
  portFrontend: getEnvVariable("PORT_FRONTEND"),
  portBackend: getEnvVariable("PORT_BACKEND"),
  jwtSecret: getEnvVariable("JWT_SECRET"),
  jwtRefreshSecret: getEnvVariable("JWT_REFRESH_SECRET"),
  nodeEnv: getEnvVariable("NODE_ENV"),
  dbHost: getEnvVariable("DB_HOST"),
  dbDatabase: getEnvVariable("DB_DATABASE"),
  dbUser: getEnvVariable("DB_USER"),
  dbPassword: getEnvVariable("DB_PASSWORD"),
};

export default config;