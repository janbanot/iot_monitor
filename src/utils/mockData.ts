import { ParameterData, StationInfo } from '../types';

export const generateMockData = (): ParameterData[] => {
  const baseData: Omit<ParameterData, 'value' | 'status' | 'lastUpdated'>[] = [
    {
      id: 'temperature',
      name: 'Temperature',
      unit: '°C',
      icon: 'Thermometer',
      ranges: {
        normal: { min: 18, max: 25 },
        warning: { min: 15, max: 30 }
      }
    },
    {
      id: 'humidity',
      name: 'Humidity',
      unit: '%',
      icon: 'Droplets',
      ranges: {
        normal: { min: 40, max: 60 },
        warning: { min: 30, max: 70 }
      }
    },
    {
      id: 'pressure',
      name: 'Pressure',
      unit: 'hPa',
      icon: 'Gauge',
      ranges: {
        normal: { min: 1000, max: 1020 },
        warning: { min: 980, max: 1040 }
      }
    },
    {
      id: 'light',
      name: 'Light Intensity',
      unit: 'lux',
      icon: 'Sun',
      ranges: {
        normal: { min: 200, max: 800 },
        warning: { min: 100, max: 1000 }
      }
    }
  ];

  return baseData.map(param => {
    let value: number;
    
    // Generate realistic values for each parameter
    switch (param.id) {
      case 'temperature':
        value = 15 + Math.random() * 20; // 15-35°C
        break;
      case 'humidity':
        value = 30 + Math.random() * 50; // 30-80%
        break;
      case 'pressure':
        value = 980 + Math.random() * 80; // 980-1060 hPa
        break;
      case 'light':
        value = 50 + Math.random() * 1000; // 50-1050 lux
        break;
      default:
        value = Math.random() * 100;
    }

    // Determine status based on ranges
    let status: 'normal' | 'warning' | 'critical';
    if (value >= param.ranges.normal.min && value <= param.ranges.normal.max) {
      status = 'normal';
    } else if (value >= param.ranges.warning.min && value <= param.ranges.warning.max) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return {
      ...param,
      value: Math.round(value * 10) / 10,
      status,
      lastUpdated: new Date()
    };
  });
};

export const getStationInfo = (): StationInfo => ({
  id: 'station-001',
  name: 'Environmental Station Alpha',
  location: 'Building A - Floor 3',
  status: 'online',
  lastSync: new Date()
});