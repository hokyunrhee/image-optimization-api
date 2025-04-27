import { IConstruct } from "constructs";
import { IAspect, ITaggable, TagManager } from "aws-cdk-lib";

export class ApplyTags<T extends Record<string, string>> implements IAspect {
  #tags: T;

  constructor({ tags }: { tags: T }) {
    this.#tags = tags;
  }

  visit(node: IConstruct) {
    if (TagManager.isTaggable(node)) {
      Object.entries(this.#tags).forEach(([key, value]) => {
        this.applyTag(node, key, value);
      });
    }
  }

  applyTag(resource: ITaggable, key: string, value: string) {
    resource.tags.setTag(key, value);
  }
}
