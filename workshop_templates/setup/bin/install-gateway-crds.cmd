@echo off
setlocal

set "GATEWAY_API_VERSION=v1.6.3"
set "BASE_URL=https://raw.githubusercontent.com/kubernetes-sigs/gateway-api"

echo Installing Gateway API CRDs (%GATEWAY_API_VERSION%)...

rem Standard Gateway API CRDs
for %%C in (gatewayclasses gateways httproutes referencegrants grpcroutes backendtlspolicies) do (
    kubectl apply -f %BASE_URL%/%GATEWAY_API_VERSION%/config/crd/standard/gateway.networking.k8s.io_%%C.yaml
    if errorlevel 1 goto :fail
)

rem TLSRoute requires experimental v1.5.0 CRD so that v1alpha2 served=true is available for Cilium Gateway API controller
echo Installing experimental TLSRoute CRD (with v1alpha2 served=true for Cilium compatibility)...
kubectl delete crd tlsroutes.gateway.networking.k8s.io --ignore-not-found
if errorlevel 1 goto :fail
kubectl apply -f %BASE_URL%/v1.5.0/config/crd/experimental/gateway.networking.k8s.io_tlsroutes.yaml
if errorlevel 1 goto :fail

echo Waiting for Gateway API CRDs to be established...
for %%C in (gatewayclasses gateways httproutes referencegrants grpcroutes backendtlspolicies tlsroutes) do (
    kubectl wait crd/%%C.gateway.networking.k8s.io --for=condition=Established --timeout=30s
    if errorlevel 1 goto :fail
)

echo Gateway API CRDs installed successfully:
kubectl get crd tlsroutes.gateway.networking.k8s.io -o jsonpath="{range .spec.versions[*]}{'  TLSRoute version: '}{.name}{'\tserved='}{.served}{'\tstorage='}{.storage}{'\n'}{end}"
if errorlevel 1 goto :fail

endlocal
exit /b 0

:fail
set "RC=%errorlevel%"
echo ERROR: command failed with exit code %RC% 1>&2
endlocal & exit /b %RC%
