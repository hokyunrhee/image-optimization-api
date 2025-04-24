#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { UploaderStack } from "~/stacks/uploader-stack";

import "../env";

const app = new cdk.App();

new UploaderStack(app, "UploaderStack", {
  env: {
    region: process.env.AWS_REGION,
  },
});
