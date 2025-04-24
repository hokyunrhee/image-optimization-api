import { config } from "dotenv";
import { z } from "zod";

config({ override: true });

const envSchema = z.object({
  AWS_REGION: z.string(),
  // AWS_ACCESS_KEY_ID: z.string(),
  // AWS_SECRET_ACCESS_KEY: z.string(),
  // AWS_SESSION_TOKEN: z.string(),
  FULLY_QUALIFIED_DOMAIN_NAME: z.string(),
  CERTIFICATE_ARN: z.string(),
  HOSTED_ZONE_ID: z.string(),
});

try {
  envSchema.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) => (errors ? `${field}: ${errors.join(", ")}` : field))
      .join("\n  ");
    throw new Error(`Missing environment variables:\n  ${errorMessage}`);
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
