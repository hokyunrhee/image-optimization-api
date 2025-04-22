import * as cdk from "aws-cdk-lib";
import {  RemovalPolicy,aws_s3 as s3  } from "aws-cdk-lib";
import { Construct } from "constructs";

import { S3UploadPresignedUrlApi } from "~/constructs/s3-upload-presigned-url-api";

export class ImageUploadPresignedUrlApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "ImageUploadBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new S3UploadPresignedUrlApi(this, "S3UploadPresignedUrlApi", {
      bucket,
    });
  }
}
