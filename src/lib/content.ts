export const navItems = ["Home", "Projects", "Stack", "Insights"];

export const stats = [
  { label: "Dashboards Built", value: "15+" },
  { label: "Experience", value: "3 Yrs" },
  { label: "Widgets Deployed", value: "50+" },
  { label: "ThingsBoard", value: "Expert" }
];

export const timeline = [
  {
    title: "ThingsBoard Mastery",
    body: "Expert in rule-engine configuration, complex dashboard design, and white-labeled IoT solutions.",
    tags: ["Widgets", "Rule Engine", "RPC"]
  },
  {
    title: "Data Pipelines & APIs",
    body: "Connecting devices through MQTT, Python backends, and secure REST APIs for robust telemetry flow.",
    tags: ["Python", "MQTT", "FastAPI"]
  },
  {
    title: "Notification Systems",
    body: "Advanced alarm logic with multi-channel escalation including SMS, email, and push notifications.",
    tags: ["Twilio", "Alerts", "Logic"]
  }
];

export const codeSample = `{
  "title": "Temperature Monitor",
  "type": "timeseries",
  "config": {
    "datasources": [{
      "type": "entity",
      "entityAliasId": "device_A1",
      "dataKeys": [{
        "name": "temp",
        "label": "Degrees Celsius",
        "color": "#C8622A"
      }]
    }],
    "settings": {
      "showLegend": true,
      "stack": false
    }
  }
}`;
