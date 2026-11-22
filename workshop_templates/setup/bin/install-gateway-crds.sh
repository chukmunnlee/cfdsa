#!/bin/bash
set -eo pipefail

GATEWAY_API_VERSION="v1.6.3"

echo "Installing Gateway API CRDs (${GATEWAY_API_VERSION})..."

# Standard Gateway API CRDs
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/${GATEWAY_API_VERSION}/config/crd/standard/gateway.networking.k8s.io_gatewayclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/${GATEWAY_API_VERSION}/config/crd/standard/gateway.networking.k8s.io_gateways.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/${GATEWAY_API_VERSION}/config/crd/standard/gateway.networking.k8s.io_httproutes.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/${GATEWAY_API_VERSION}/config/crd/standard/gateway.networking.k8s.io_referencegrants.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/${GATEWAY_API_VERSION}/config/crd/standard/gateway.networking.k8s.io_grpcroutes.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/${GATEWAY_API_VERSION}/config/crd/standard/gateway.networking.k8s.io_backendtlspolicies.yaml

# TLSRoute requires experimental v1.5.0 CRD so that v1alpha2 served=true is available for Cilium Gateway API controller
echo "Installing experimental TLSRoute CRD (with v1alpha2 served=true for Cilium compatibility)..."
kubectl delete crd tlsroutes.gateway.networking.k8s.io --ignore-not-found
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.5.0/config/crd/experimental/gateway.networking.k8s.io_tlsroutes.yaml

echo "Waiting for Gateway API CRDs to be established..."
kubectl wait crd/gatewayclasses.gateway.networking.k8s.io --for=condition=Established --timeout=30s
kubectl wait crd/gateways.gateway.networking.k8s.io --for=condition=Established --timeout=30s
kubectl wait crd/httproutes.gateway.networking.k8s.io --for=condition=Established --timeout=30s
kubectl wait crd/referencegrants.gateway.networking.k8s.io --for=condition=Established --timeout=30s
kubectl wait crd/grpcroutes.gateway.networking.k8s.io --for=condition=Established --timeout=30s
kubectl wait crd/backendtlspolicies.gateway.networking.k8s.io --for=condition=Established --timeout=30s
kubectl wait crd/tlsroutes.gateway.networking.k8s.io --for=condition=Established --timeout=30s

echo "Gateway API CRDs installed successfully:"
kubectl get crd tlsroutes.gateway.networking.k8s.io -o jsonpath='{range .spec.versions[*]}{"  TLSRoute version: "}{.name}{"\tserved="}{.served}{"\tstorage="}{.storage}{"\n"}{end}'
