#!/bin/bash
kubectl create secret docker-registry dov-bear-registry -nworkshop03 \
  --docker-server=registry.gitlab.com \
  --docker-username=__USER__ \
  --docker-password=__PASSWORD__ \
  --docker-email=__EMAIL__ \
  --dry-run=client -oyaml

