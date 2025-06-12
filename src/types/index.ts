export interface ParameterData {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: string;
  status: "normal" | "warning" | "critical";
  lastUpdated: Date;
  ranges: {
    normal: { min: number; max: number };
    warning: { min: number; max: number };
  };
}

export interface StationInfo {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastSync: Date;
}
