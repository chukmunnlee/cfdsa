#/bin/bash

curl -XPOST --data-binary @bin/payload.json -H 'Content-Type: application/json' localhost:3000/jwt/sign
