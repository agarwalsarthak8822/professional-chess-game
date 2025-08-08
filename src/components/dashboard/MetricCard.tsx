import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: keyof typeof iconMap;
}

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  Activity,
};

export function MetricCard({
  title,
  value,
  change,
  changeText,
  icon,
}: MetricCardProps) {
  const Icon = iconMap[icon];
  const isPositive = change >= 0;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={cn(
              "text-xs font-medium",
              isPositive
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : "bg-red-100 text-red-700 hover:bg-red-100",
            )}
          >
            {isPositive ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(change)}%
          </Badge>
          <span>{changeText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
