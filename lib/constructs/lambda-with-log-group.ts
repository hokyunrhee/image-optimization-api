import { Construct } from "constructs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, LogGroupProps, RetentionDays } from "aws-cdk-lib/aws-logs";

import merge from "lodash.merge";

interface LambdaWithLogGroupProps extends NodejsFunctionProps {
  logGroupProps?: Omit<LogGroupProps, "logGroupName">;
}

const defaultProps: LambdaWithLogGroupProps = {
  runtime: Runtime.NODEJS_22_X,
  memorySize: 1024,
  timeout: Duration.seconds(3),
  architecture: Architecture.ARM_64,
  logGroupProps: {
    retention: RetentionDays.ONE_DAY,
    removalPolicy: RemovalPolicy.DESTROY,
  },
};

export class LambdaWithLogGroup extends NodejsFunction {
  constructor(scope: Construct, id: string, props: LambdaWithLogGroupProps) {
    const mergedProps = merge({}, defaultProps, props);

    super(scope, id, mergedProps);

    const { logGroupProps } = mergedProps;

    new LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${this.functionName}`,
      ...logGroupProps,
    });
  }
}
