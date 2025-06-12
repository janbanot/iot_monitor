import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ParameterCard from "./components/ParameterCard";
import { createThingSpeakService } from "./services/thingspeak";
import {
  mapThingSpeakToParameterData,
  mapChannelToStationInfo,
} from "./utils/thingSpeakDataMapper";
import { ParameterData, StationInfo } from "./types";

function App() {
  const [parameters, setParameters] = useState<ParameterData[]>([]);
  const [stationInfo, setStationInfo] = useState<StationInfo>({
    id: "station-001",
    name: "Technolgie Internetu Rzeczy - IoT Station",
    lastSync: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const thingSpeakService = createThingSpeakService();

  const fetchData = async () => {
    try {
      setError(null);

      // Fetch latest sensor data
      const latestEntry = await thingSpeakService.getLatestEntry();
      if (latestEntry) {
        const mappedParameters = mapThingSpeakToParameterData(latestEntry);
        setParameters(mappedParameters);
      }

      // Fetch channel info for station details
      try {
        const channelInfo = await thingSpeakService.getChannelInfo();
        const mappedStationInfo = mapChannelToStationInfo(
          channelInfo,
          new Date(),
        );
        setStationInfo(mappedStationInfo);
      } catch (channelError) {
        console.warn("Could not fetch channel info, using defaults");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching ThingSpeak data:", err);
      setError("Failed to fetch sensor data. Using offline mode.");
      setStationInfo((prev) => ({ ...prev, status: "offline" }));
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial data load
    fetchData();

    // Real-time updates every 10 seconds (matching Arduino upload frequency)
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  const criticalCount = parameters.filter(
    (p) => p.status === "critical",
  ).length;
  const warningCount = parameters.filter((p) => p.status === "warning").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stationInfo={stationInfo} />

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 text-red-500">⚠️</div>
                <div>
                  <h3 className="font-medium text-red-800">Connection Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Status Summary */}
        {(criticalCount > 0 || warningCount > 0) && (
          <div className="mb-8">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                System Status
              </h2>
              <div className="flex flex-wrap gap-4">
                {criticalCount > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">
                      {criticalCount} Critical Alert
                      {criticalCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">
                      {warningCount} Warning{warningCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Parameter Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {parameters.map((parameter) => (
            <ParameterCard key={parameter.id} parameter={parameter} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
