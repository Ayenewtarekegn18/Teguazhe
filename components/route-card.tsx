import { Train, Bus, Plane, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  from: string;
  to: string;
  type: "train" | "bus" | "plane";
  duration: string;
  price: string;
  isPopular?: boolean;
  isFastest?: boolean;
  availableSeats: number;
  className?: string;
}

const transportIcons = {
  train: Train,
  bus: Bus,
  plane: Plane,
};

export function RouteCard({
  from,
  to,
  type,
  duration,
  price,
  isPopular,
  isFastest,
  availableSeats,
  className,
}: RouteCardProps) {
  const TransportIcon = transportIcons[type];

  return (
    <div className={cn("route-card group", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <TransportIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">
              {from} → {to}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{price}</p>
          <div className="flex items-center justify-end space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{availableSeats} seats left</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        {isPopular && (
          <span className="badge badge-primary">Popular Today</span>
        )}
        {isFastest && (
          <span className="badge badge-secondary">Fastest Route</span>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button className="btn-primary rounded-full px-4 py-2 text-sm font-medium">
          Book Now
        </button>
      </div>
    </div>
  );
}
