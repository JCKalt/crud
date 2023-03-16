// lambda function name: http-crud-tutorial-function
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "purify-config";
const secretKey = "a8cbdc83bad52ed9b2f1a59fc5833b19";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  let secretStatus = "Secret key not provided or invalid.";
  console.log("Headers:", event.headers);
  console.log("Path Parameters:", event.pathParameters);

  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) {
    console.log("Check1: Authorization header is missing");
  } else {
    console.log("Check2: Authorization header is present");
  }

  try {
    if (
      authHeader
      ) {
      console.log("Authorization.header -->", authHeader);
      const apart1 = authHeader.split(" ")[0].toLowerCase();
      console.log("apart1 -->", apart1);
      if (apart1 === "bearer") {
        const apart2 = authHeader.split(" ")[1];
        console.log("apart2 -->", apart2);
        if (apart2 === secretKey.toLowerCase()) {
            secretStatus = "Secret key validated successfully.";
            console.log("key good");
        } else {
            secretStatus = "Invalid secret key provided.";
            console.log("key bad");
            return {
              statusCode: 403,
              body: JSON.stringify({ error: secretStatus }),
              headers,
            };  
        }
      }
    }
    else {
      console.log("Check 2: Authorization header is missing");
      secretStatus = "Secret key is missing.";
      return {
        statusCode: 401,
        body: JSON.stringify({ error: secretStatus }),
        headers,
      };
    }
    console.log("SecretStatus:", secretStatus);

    switch (event.routeKey) {
      case "DELETE /items/{serial}/{timestamp}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              serial: event.pathParameters.serial,
              timestamp: parseInt(event.pathParameters.timestamp)
            },
          })
        );
        body = `Deleted item serial=${event.pathParameters.serial} timestamp=${event.pathParameters.timestamp}`;
        break;
      case "GET /items/{serial}/{timestamp}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              serial: event.pathParameters.serial,
              timestamp: parseInt(event.pathParameters.timestamp)
            },
          })
        );
        body = body.Item;
        break;
      case "GET /items":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              serial: requestJSON.serial,
              timestamp: requestJSON.timestamp,
              payload: requestJSON.payload,
            },
          })
        );
        body = `Put item ${requestJSON.serial}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
