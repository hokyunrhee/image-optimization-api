import { z } from "zod";

const envSchema = z.object({
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
