import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const CurrentDateBadge = () => {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      setLabel(`Updated • ${now.toLocaleDateString('en-US', options)}`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground/70 bg-muted/30 border border-border rounded-full px-3 py-1">
      <Calendar className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
  );
};

export default CurrentDateBadge;


