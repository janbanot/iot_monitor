import React from "react";
import {
  Thermometer,
  Droplets,
  Gauge,
  Sun,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ParameterData } from "../types";

interface ParameterCardProps {
  parameter: ParameterData;
}

const ParameterCard: React.FC<ParameterCardProps> = ({ parameter }) => {
  const getIcon = () => {
    const iconProps = { className: "w-8 h-8" };
    switch (parameter.icon) {
      case "Thermometer":
        return <Thermometer {...iconProps} />;
      case "Droplets":
        return <Droplets {...iconProps} />;
      case "Gauge":
        return <Gauge {...iconProps} />;
      case "Sun":
        return <Sun {...iconProps} />;
      default:
        return <Gauge {...iconProps} />;
    }
  };

  const getStatusIcon = () => {
    switch (parameter.status) {
      case "normal":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (parameter.status) {
      case "normal":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
    }
  };

  const getCardBorderColor = () => {
    switch (parameter.status) {
      case "normal":
        return "border-l-green-400";
      case "warning":
        return "border-l-yellow-400";
      case "critical":
        return "border-l-red-400";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-l-4 ${getCardBorderColor()} p-6 hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-gray-100 ${getStatusColor()}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {parameter.name}
            </h3>
            <p className="text-sm text-gray-500">ID: {parameter.id}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            {parameter.value}
          </span>
          <span className="text-lg text-gray-600">{parameter.unit}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Normal Range:</span>
          <span className="text-gray-700">
            {parameter.ranges.normal.min} - {parameter.ranges.normal.max}{" "}
            {parameter.unit}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <span className={`font-medium capitalize ${getStatusColor()}`}>
            {parameter.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParameterCard;
