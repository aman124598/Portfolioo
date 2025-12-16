interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-4xl font-bold text-white mb-2">{value}</p>
      {trend && (
        <p className={`text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
        </p>
      )}
    </div>
  );
}
