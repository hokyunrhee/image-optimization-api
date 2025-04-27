#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { config } from "~/config";
import { Stage } from "~/stage";
import { tags } from "~/tags";

import "../env";

const app = new cdk.App();

new Stage(app, "prod", { config, tags });
