#!/bin/bash

curl -X "PUT" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer a8cbdc83bad52ed9b2f1a59fc5833b19" \
    -d "$(cat <<EOF
{
  "serial": "123",
  "timestamp": 12345,
  "payload": {
        "pettype": "cat",
        "name": "theo"
  }
}
EOF
)" \
    https://7jdqys3801.execute-api.us-east-2.amazonaws.com/items
