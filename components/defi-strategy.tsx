import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface DefiStrategyProps {
  strategy: string;
  desiTwist: string;
}

export default function DefiStrategyCard({
  strategy,
  desiTwist,
}: DefiStrategyProps) {
  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-[10px]">
            DeFi Strategy
          </Badge>
        </div>
        <CardDescription className="text-[14px] font-medium">
          {strategy}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-[10px] text-muted-foreground cursor-help">
          <Info className="w-4 h-4 mr-1" />
          Relate with the Web2 world
        </div>
        <p className="text-[10px] text-muted-foreground mb-4 mt-4">
          {desiTwist}
        </p>
      </CardContent>
    </Card>
  );
}
