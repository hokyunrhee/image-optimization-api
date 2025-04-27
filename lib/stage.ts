import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

import { ApplyTags } from "~/aspects/apply-tags";
import { UploaderStack } from "~/stacks/uploader-stack";
import { Config, Tags } from "~/types";

interface StageProps extends cdk.StageProps {
  config: Config;
  tags: Tags;
}

export class Stage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const { config, tags } = props;

    new UploaderStack(this, "UploaderStack", {
      certificateArn: config.certificateArn,
      fullyQualifiedDomainName: config.fullyQualifiedDomainName,
      hostedZoneId: config.hostedZoneId,
    });

    cdk.Aspects.of(this).add(new ApplyTags({ tags }));
  }
}
