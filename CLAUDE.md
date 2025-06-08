# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Docker Commands

- `docker-compose up` - Run production build in container (port 3000)
- `docker-compose --profile dev up` - Run development server in container (port 5173)
- `docker build -t iot-monitor .` - Build production Docker image

## Architecture Overview

This is a React + TypeScript IoT monitoring dashboard that displays real-time environmental sensor data.

### Key Architecture Components

- **App.tsx**: Main application with 30-second auto-refresh interval for real-time data simulation
- **Mock Data System**: `utils/mockData.ts` generates realistic sensor values with status classification based on configurable ranges
- **Parameter Status Logic**: Three-tier status system (normal/warning/critical) determined by value ranges defined in parameter configuration
- **Component Structure**: Card-based grid layout with status indicators, icons from Lucide React, and Tailwind CSS styling

### Data Flow

1. App connects to ThingSpeak API using channel ID 2983726
2. Fetches latest sensor readings every 30 seconds (matching Arduino upload frequency)
3. Maps ThingSpeak fields to parameter data:
   - Field1: Temperature (°C)
   - Field2: Humidity (%)
   - Field3: Pressure (hPa)
   - Field4: Light intensity (RGB average)
   - Fields 5-8: Alert flags from Arduino device
4. Status classification based on alert flags and threshold ranges
5. UI renders real-time data with error handling for offline scenarios

### ThingSpeak Integration

- Uses public ThingSpeak channel (no API key required for reading)
- Configurable via environment variables (VITE_THINGSPEAK_CHANNEL_ID, VITE_THINGSPEAK_READ_API_KEY)
- Automatic fallback to offline mode if API is unavailable
- Real sensor data from Arduino MKR IoT Carrier device

### TypeScript Interfaces

- `ParameterData`: Sensor readings with value, status, ranges, and metadata
- `StationInfo`: Station identification and connection status

### Styling

- Tailwind CSS with responsive grid layouts
- Status-based color coding (green/yellow/red)
- Card components with left border indicators matching status colors