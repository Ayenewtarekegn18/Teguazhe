import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="app-promo-banner animate-slide-up">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <h3 className="text-lg font-semibold">Get the Transport App</h3>
            <p className="text-sm opacity-90">
              Book tickets, track routes, and more on the go
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="font-medium">
              Download iOS
            </Button>
            <Button variant="secondary" size="sm" className="font-medium">
              Download Android
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close banner</span>
        </Button>
      </div>
    </div>
  );
}
