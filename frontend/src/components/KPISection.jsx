import { Users, FileText, Activity, Clock } from "lucide-react";

function KPISection({ stats, onKpiClick }) {
  const cards = [
    {
      title: "Total Logs",
      value: stats?.totalLogs || 0,
      icon: <FileText className="text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: "Unique Users",
      value: stats?.uniqueUsers || 0,
      icon: <Users className="text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      title: "Recent Logs (24h)",
      value: stats?.recentLogs || 0,
      icon: <Activity className="text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "Active Actions",
      value: stats?.actionDistribution?.length || 0,
      icon: <Clock className="text-orange-500" />,
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          onClick={() => onKpiClick && onKpiClick(card.title)}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-blue-200 transition-all"
        >
          <div className={`${card.color} p-3 rounded-lg`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KPISection;
