import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, UserPlus, TrendingUp, UserMinus } from "lucide-react";
import { recentActivity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const activityIcons = {
  sale: ShoppingCart,
  signup: UserPlus,
  upgrade: TrendingUp,
  churn: UserMinus,
};

const activityColors = {
  sale: "bg-emerald-100 text-emerald-600",
  signup: "bg-blue-100 text-blue-600",
  upgrade: "bg-purple-100 text-purple-600",
  churn: "bg-red-100 text-red-600",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest customer activities and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className={cn("border", colorClass)}>
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
                {activity.value && (
                  <Badge variant="secondary" className="font-medium">
                    +${activity.value}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
