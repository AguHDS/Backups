const allowedOrigins = [
  `http://localhost:${process.env.PORT_FRONTEND}`,
  `http://localhost:${process.env.PORT_BACKEND}`,
];

export default allowedOrigins;