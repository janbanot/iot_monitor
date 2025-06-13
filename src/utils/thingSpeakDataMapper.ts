import { ParameterData, StationInfo } from "../types";

interface ThingSpeakEntry {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature
  field2: string; // Humidity
  field3: string; // Pressure
  field4: string; // Light
  field5: string; // Temperature Alert
  field6: string; // Humidity Alert
  field7: string; // Pressure Alert
  field8: string; // Light Alert
}

export const mapThingSpeakToParameterData = (
  entry: ThingSpeakEntry,
): ParameterData[] => {
  console.log("Raw ThingSpeak entry:", entry);

  const temperature = parseFloat(entry.field1) || 0;
  const humidity = parseFloat(entry.field2) || 0;
  const pressure = parseFloat(entry.field3) * 10 || 0; // Convert kPa to hPa
  const light = parseFloat(entry.field4) || 0;

  const tempAlert = entry.field5 === "1";
  const humAlert = entry.field6 === "1";
  const pressAlert = entry.field7 === "1";
  const lightAlert = entry.field8 === "1";

  const lastUpdated = new Date(entry.created_at);

  console.log("Parsed values:", { temperature, humidity, pressure, light });
  console.log("Alert flags:", { tempAlert, humAlert, pressAlert, lightAlert });

  return [
    {
      id: "temperature",
      name: "Temperature",
      value: Math.round(temperature * 10) / 10,
      unit: "°C",
      icon: "Thermometer",
      status: tempAlert
        ? temperature < 15 || temperature > 30
          ? "critical"
          : "warning"
        : temperature < 18 || temperature > 25
          ? temperature < 15 || temperature > 30
            ? "critical"
            : "warning"
          : "normal",
      lastUpdated,
      ranges: {
        normal: { min: 18, max: 25 },
        warning: { min: 15, max: 30 },
      },
    },
    {
      id: "humidity",
      name: "Humidity",
      value: Math.round(humidity * 10) / 10,
      unit: "%",
      icon: "Droplets",
      status: humAlert
        ? humidity < 10 || humidity > 80
          ? "critical"
          : "warning"
        : humidity < 30 || humidity > 50
          ? humidity < 10 || humidity > 80
            ? "critical"
            : "warning"
          : "normal",
      lastUpdated,
      ranges: {
        normal: { min: 30, max: 50 },
        warning: { min: 10, max: 80 },
      },
    },
    {
      id: "pressure",
      name: "Pressure",
      value: Math.round(pressure),
      unit: "hPa",
      icon: "Gauge",
      status: pressAlert
        ? pressure >= 980 && pressure <= 989
          ? "warning"
          : "critical"
        : pressure >= 980 && pressure <= 989
          ? "warning"
          : pressure < 950 || pressure > 1050
            ? "critical"
            : "normal",
      lastUpdated,
      ranges: {
        normal: { min: 990, max: 1020 },
        warning: { min: 980, max: 989 },
      },
    },
    {
      id: "light",
      name: "Light Intensity",
      value: Math.round(light),
      unit: "lumen",
      icon: "Sun",
      status: lightAlert
        ? light === 0 || light > 200
          ? "critical"
          : "warning"
        : light > 0 && light < 100
          ? "warning"
          : light === 0 || light > 200
            ? "critical"
            : "normal",
      lastUpdated,
      ranges: {
        normal: { min: 100, max: 200 },
        warning: { min: 1, max: 99 },
      },
    },
  ];
};

export const mapChannelToStationInfo = (
  channel: any,
  lastSync: Date,
): StationInfo => {
  return {
    id: channel.id?.toString() || "station-001",
    name: channel.name || "Environmental Station Alpha",
    location: channel.description || "Building A - Floor 3",
    status: "online" as const,
    lastSync,
  };
};
