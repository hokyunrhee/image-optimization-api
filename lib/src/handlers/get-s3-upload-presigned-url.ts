import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";

import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import mime from "mime-types";
import invariant from "tiny-invariant";
import { z } from "zod";

import { ExtendedLogFormatter } from "../utils/logger";
import { parser } from "../utils/parser";

const logger = new Logger({
  serviceName: "get-s3-upload-presigned-url",
  sampleRateValue: 0.1,
  logFormatter: new ExtendedLogFormatter(),
});

const s3Client = new S3Client();

const lambdaHandler = async (event: z.infer<typeof eventSchema>): Promise<APIGatewayProxyResult> => {
  const key = event.body.key;
  const contentType = mime.lookup(key);

  invariant(contentType, "Content type not found");

  const putObjectParams: PutObjectCommandInput = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key: key,
    ContentType: contentType,
  };
  const command = new PutObjectCommand(putObjectParams);

  const preSignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: parseInt(process.env.EXPIRATION_SECONDS || "300"),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      preSignedUrl,
      key,
    }),
  };
};

const eventSchema = z.object({
  body: z.object({
    key: z.string(),
  }),
});

export const handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
  .use(injectLambdaContext(logger))
  .use(jsonBodyParser())
  .use(parser({ eventSchema }))
  .use(httpErrorHandler())
  .use(
    errorLogger({
      logger: ({ error }) => logger.error(error instanceof Error ? error.message : "Unexpected Error", { error }),
    }),
  )
  .handler<z.infer<typeof eventSchema>>(lambdaHandler);
