import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node"
import {PrometheusExporter} from "@opentelemetry/exporter-prometheus"
import {resourceFromAttributes} from "@opentelemetry/resources"
import {MeterProvider, PeriodicExportingMetricReader} from "@opentelemetry/sdk-metrics"
import {NodeSDK} from "@opentelemetry/sdk-node"
import {ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION} from "@opentelemetry/semantic-conventions"

export let PROM_PORT = 9464
export let PROM_ENDPOINT = '/metrics'
export let PROM_INTERVAL = 15
export let METER_NAME = 'fake-api'

export function Telemetry(serviceName, version) {
  this.prometheus = new PrometheusExporter(
    { port: PROM_PORT, endpoint: PROM_ENDPOINT },
    () => console.info(`Metrics endpoint at ${PROM_PORT}${PROM_ENDPOINT}`)
  )

  this.meterProvider = new MeterProvider({ readers: [ this.prometheus ], views: [] })
  this.meter = this.meterProvider.getMeter(METER_NAME)

  this.metricReader = new PeriodicExportingMetricReader({
    exporter: this.prometheus, 
    exportIntervalMillis: PROM_INTERVAL * 1000
  })

  this.sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: version
    }),
    metricReader: this.metricReader,
    instrumentations: [ getNodeAutoInstrumentations() ]
  })
}

Telemetry.prototype.start = function() {
  return this.sdk.start()
}
Telemetry.prototype.stop = function() {
  this.sdk.shutdown()
}

