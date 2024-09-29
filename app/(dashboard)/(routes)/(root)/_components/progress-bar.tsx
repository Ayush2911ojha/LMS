interface ProgressBarProps {
    label: string;      // Label should be a string
    percentage: number; // Percentage should be a number
    color: string;      // Color should be a string representing the CSS class or color
  }
  
  export const ProgressBar = ({ label, percentage, color }: ProgressBarProps) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div
          className={`${color} h-6 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
        <p className="mt-2 text-sm font-medium text-gray-700">
          {label}: {percentage}%
        </p>
      </div>
    );
  };
  