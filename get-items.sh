#!/bin/sh
curl \
  -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  https://7jdqys3801.execute-api.us-east-2.amazonaws.com/items | jq
