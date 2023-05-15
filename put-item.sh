#!/bin/bash
curl -X "PUT" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
    -d "$(cat <<EOF
{
  "serial": "123",
  "timestamp": 12345,
  "payload": {
      "active": {
          "name": "Clean",
          "off_at": 0,
          "on_at": 0
      }
  },
  "thresholds": [
      {
        "name": "Clean",
        "off_at": 0,
        "on_at": 0
      }
  ]
}
EOF
)" \
    https://7jdqys3801.execute-api.us-east-2.amazonaws.com/items
