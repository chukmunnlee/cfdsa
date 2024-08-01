#/bin/bash

if [ -z "${TOKEN}" ]; then
    TOKEN="abc123"
fi

echo "TOKEN = ${TOKEN}"

curl -XPOST -H "Authorization: Bearer ${TOKEN}" localhost:3000/jwt/validate
