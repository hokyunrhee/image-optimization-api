import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { aws_certificatemanager as acm, RemovalPolicy, aws_route53 as route53, aws_s3 as s3 } from "aws-cdk-lib";

import { S3UploadPresignedUrlApi } from "~/constructs/s3-upload-presigned-url-api";

export class UploaderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificate = acm.Certificate.fromCertificateArn(this, "Certificate", process.env.CERTIFICATE_ARN);
    const hostedZone = route53.HostedZone.fromHostedZoneId(this, "HostedZone", process.env.HOSTED_ZONE_ID);
    const bucket = new s3.Bucket(this, "Bucket", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new S3UploadPresignedUrlApi(this, "S3UploadPresignedUrlApi", {
      bucket,
      fullyQualifiedDomainName: process.env.FULLY_QUALIFIED_DOMAIN_NAME,
      certificate,
      hostedZone,
    });
  }
}
