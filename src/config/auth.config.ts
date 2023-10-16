import { registerAs } from "@nestjs/config";
export const ENV_VARIABLES = process.env as any;

export default registerAs("auth", () => ({
  jwt: {
    secret: ENV_VARIABLES.JWT_SECRET,
    signOptions: {
      expiresIn: "1h",
    },
  },
}));
