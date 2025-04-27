import { Config } from "./types";

export const config: Config = {
  certificateArn: process.env.CERTIFICATE_ARN,
  fullyQualifiedDomainName: process.env.FULLY_QUALIFIED_DOMAIN_NAME,
  hostedZoneId: process.env.HOSTED_ZONE_ID,
};
