import { aws_s3 as s3, aws_apigateway as apiGateway } from "aws-cdk-lib";
import { Construct } from "constructs";

import { LambdaWithLogGroup } from "./lambda-with-log-group";

interface S3UploadPresignedUrlApiProps {
  bucket: s3.Bucket;
}

export class S3UploadPresignedUrlApi extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: S3UploadPresignedUrlApiProps,
  ) {
    super(scope, id);

    const { bucket } = props;

    const getS3SignedUrlLambda = new LambdaWithLogGroup(
      this,
      "LambdaWithLogGroup",
      {
        description:
          "Lambda function that generates a presigned URL for S3 file uploads",
        entry: "src/index.ts",
        environment: {
          UPLOAD_BUCKET: bucket.bucketName,
          // URL_EXPIRATION_SECONDS: (props?.expiration || 300).toString(),
          // ALLOWED_ORIGIN: props?.allowedOrigins?.join(",") || "*",
        },
      },
    );

    bucket.grantPut(getS3SignedUrlLambda);

    const restApi = new apiGateway.RestApi(this, "RestApi", {
      description: "API for retrieving presigned URLs for S3 file uploads",
      endpointTypes: [apiGateway.EndpointType.REGIONAL],
    });

    restApi.root.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(getS3SignedUrlLambda),
    );
  }
}
