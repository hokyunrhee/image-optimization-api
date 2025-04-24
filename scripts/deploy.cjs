const { execSync } = require("child_process");
const path = require("path");
const { z } = require("zod");
const chalk = require("chalk");

const envSchema = z.object({
  BUCKET_NAME: z.string(),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error(chalk.red(`Error: Environment variable BUCKET_NAME is not set.`));
  process.exit(1);
}

const constructsPath = path.join(
  __dirname,
  "..",
  "dynamic-image-transformation-for-amazon-cloudfront",
  "source",
  "constructs",
);

try {
  console.log(
    chalk.green("Deploying") +
      " " +
      chalk.blue("Dynamic Image Transformation for Amazon CloudFront") +
      chalk.green("..."),
  );

  process.chdir(constructsPath);

  execSync("npm run clean:install", { stdio: "inherit" });

  const bootstrapCommand = `overrideWarningsEnabled=false npx cdk bootstrap`;
  execSync(bootstrapCommand, { stdio: "inherit" });

  const deployCommand = `
  overrideWarningsEnabled=false npx cdk deploy \
  --parameters DeployDemoUIParameter=No \
  --parameters LogRetentionPeriodParameter=7 \
  --parameters EnableS3ObjectLambdaParameter=No \
  --parameters SourceBucketsParameter=${process.env.BUCKET_NAME}`;
  execSync(deployCommand, { stdio: "inherit" });

  console.log(chalk.green("Deployment successful."));
  process.exit(0);
} catch (error) {
  console.error(chalk.red("Error occurred during script execution:"), error);
  process.exit(1);
}
