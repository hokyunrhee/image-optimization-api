import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { aws_certificatemanager as acm, RemovalPolicy, aws_route53 as route53, aws_s3 as s3 } from "aws-cdk-lib";

import { S3UploadPresignedUrlApi } from "~/constructs/s3-upload-presigned-url-api";

interface UploaderStackProps extends cdk.StackProps {
  certificateArn: string;
  hostedZoneId: string;
  fullyQualifiedDomainName: string;
}

export class UploaderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UploaderStackProps) {
    super(scope, id, props);

    const { certificateArn, hostedZoneId, fullyQualifiedDomainName } = props;

    const certificate = acm.Certificate.fromCertificateArn(this, "Certificate", certificateArn);
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      zoneName: fullyQualifiedDomainName,
      hostedZoneId,
    });

    const bucket = new s3.Bucket(this, "Bucket", {
      removalPolicy: RemovalPolicy.RETAIN,
    });

    new S3UploadPresignedUrlApi(this, "S3UploadPresignedUrlApi", {
      bucket,
      fullyQualifiedDomainName: fullyQualifiedDomainName,
      certificate,
      hostedZone,
    });
  }
}
