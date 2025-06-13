import React from "react";
import { Activity, Wifi, WifiOff, Wrench } from "lucide-react";
import { StationInfo } from "../types";

interface HeaderProps {
  stationInfo: StationInfo;
}

const Header: React.FC<HeaderProps> = ({ stationInfo }) => {
  const getStatusIcon = () => {
    switch (stationInfo.status) {
      case "online":
        return <Wifi className="w-5 h-5 text-green-500" />;
      case "offline":
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case "maintenance":
        return <Wrench className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (stationInfo.status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Format the last sync date to "YYYY-MM-DD, HH:mm:ss" (24h format)
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}, ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {stationInfo.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last sync:{" "}
              {formatDate(new Date(stationInfo.lastSync)).toLocaleString()}
            </div>
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="capitalize">{stationInfo.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
