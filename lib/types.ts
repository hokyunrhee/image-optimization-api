export type Stage = "dev" | "staging" | "prod";

export interface Tags extends Record<string, string> {
  stage: Stage;
}

export interface Config {
  certificateArn: string;
  fullyQualifiedDomainName: string;
  hostedZoneId: string;
}
