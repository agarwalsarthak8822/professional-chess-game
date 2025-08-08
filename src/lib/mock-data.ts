export interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  users: number;
  conversion: number;
  sessions: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface RecentActivity {
  id: string;
  type: "sale" | "signup" | "upgrade" | "churn";
  description: string;
  timestamp: string;
  value?: number;
}

export const metricCards: MetricCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: 20.1,
    changeText: "from last month",
    icon: "DollarSign",
  },
  {
    title: "Active Users",
    value: "12,543",
    change: 15.3,
    changeText: "from last month",
    icon: "Users",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: -2.4,
    changeText: "from last month",
    icon: "TrendingUp",
  },
  {
    title: "Total Sessions",
    value: "89,232",
    change: 12.8,
    changeText: "from last month",
    icon: "Activity",
  },
];

export const chartData: ChartDataPoint[] = [
  { date: "Jan", revenue: 4200, users: 1200, conversion: 3.1, sessions: 8500 },
  { date: "Feb", revenue: 5100, users: 1350, conversion: 3.4, sessions: 9200 },
  { date: "Mar", revenue: 4800, users: 1280, conversion: 2.9, sessions: 8800 },
  { date: "Apr", revenue: 6200, users: 1580, conversion: 3.6, sessions: 10500 },
  { date: "May", revenue: 7100, users: 1820, conversion: 3.8, sessions: 11200 },
  { date: "Jun", revenue: 6800, users: 1750, conversion: 3.5, sessions: 10800 },
  { date: "Jul", revenue: 8200, users: 2100, conversion: 4.1, sessions: 12500 },
  { date: "Aug", revenue: 7500, users: 1950, conversion: 3.7, sessions: 11800 },
  { date: "Sep", revenue: 8900, users: 2280, conversion: 4.3, sessions: 13200 },
  { date: "Oct", revenue: 9200, users: 2350, conversion: 4.0, sessions: 13500 },
  {
    date: "Nov",
    revenue: 10100,
    users: 2580,
    conversion: 4.5,
    sessions: 14200,
  },
  {
    date: "Dec",
    revenue: 11200,
    users: 2820,
    conversion: 4.2,
    sessions: 15100,
  },
];

export const topProducts: TopProduct[] = [
  { name: "Pro Plan", sales: 1234, revenue: 45670, growth: 12.3 },
  { name: "Basic Plan", sales: 2341, revenue: 23450, growth: 8.7 },
  { name: "Enterprise", sales: 423, revenue: 67890, growth: 24.1 },
  { name: "Starter", sales: 3456, revenue: 12340, growth: -2.4 },
  { name: "Premium Add-on", sales: 876, revenue: 8760, growth: 15.6 },
];

export const recentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "sale",
    description: "New subscription to Pro Plan",
    timestamp: "2 minutes ago",
    value: 99,
  },
  {
    id: "2",
    type: "signup",
    description: "New user registered",
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    type: "upgrade",
    description: "User upgraded to Enterprise",
    timestamp: "12 minutes ago",
    value: 299,
  },
  {
    id: "4",
    type: "sale",
    description: "Premium add-on purchased",
    timestamp: "18 minutes ago",
    value: 49,
  },
  {
    id: "5",
    type: "churn",
    description: "User cancelled subscription",
    timestamp: "25 minutes ago",
  },
  {
    id: "6",
    type: "sale",
    description: "Basic plan renewal",
    timestamp: "32 minutes ago",
    value: 29,
  },
];

export const deviceData = [
  { device: "Desktop", users: 4567, percentage: 62.3 },
  { device: "Mobile", users: 2341, percentage: 31.9 },
  { device: "Tablet", users: 423, percentage: 5.8 },
];

export const trafficSources = [
  { source: "Organic Search", visitors: 3456, percentage: 45.2 },
  { source: "Direct", visitors: 2134, percentage: 27.9 },
  { source: "Social Media", visitors: 1245, percentage: 16.3 },
  { source: "Email", visitors: 567, percentage: 7.4 },
  { source: "Paid Ads", visitors: 234, percentage: 3.1 },
];
