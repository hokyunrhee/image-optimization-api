import path from "node:path";

import { Construct } from "constructs";
import { FileSystem } from "aws-cdk-lib";
import { EndpointType, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway as ApiGatewayTarget } from "aws-cdk-lib/aws-route53-targets";
import { IBucket } from "aws-cdk-lib/aws-s3";

import { LambdaWithLogGroup } from "./lambda-with-log-group";

interface S3UploadPresignedUrlApiProps {
  bucket: IBucket;
  fullyQualifiedDomainName: string;
  certificate: ICertificate;
  hostedZone: IHostedZone;
}

export class S3UploadPresignedUrlApi extends Construct {
  constructor(scope: Construct, id: string, props: S3UploadPresignedUrlApiProps) {
    super(scope, id);

    const { bucket, fullyQualifiedDomainName, certificate, hostedZone } = props;

    const handlerPath = path.join(__dirname, "..", "src", "handlers", "get-s3-upload-presigned-url.ts");
    const getS3SignedUrlLambda = new LambdaWithLogGroup(this, "LambdaWithLogGroup", {
      description: FileSystem.fingerprint(handlerPath),
      entry: handlerPath,
      environment: {
        UPLOAD_BUCKET: bucket.bucketName,
        EXPIRATION_SECONDS: "180",
      },
    });

    bucket.grantPut(getS3SignedUrlLambda);

    const restApi = new RestApi(this, "RestApi", {
      description: "API for retrieving presigned URLs for S3 file uploads",
      endpointTypes: [EndpointType.REGIONAL],
      domainName: {
        domainName: fullyQualifiedDomainName,
        certificate,
      },
    });
    const apiKey = restApi.addApiKey("ApiKey", {
      description: "API Key for the S3 Upload Presigned URL API",
    });
    const usagePlan = restApi.addUsagePlan("UsagePlan");
    usagePlan.addApiKey(apiKey);

    restApi.root.addMethod("POST", new LambdaIntegration(getS3SignedUrlLambda));

    new ARecord(this, "ARecord", {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new ApiGatewayTarget(restApi)),
    });
  }
}
