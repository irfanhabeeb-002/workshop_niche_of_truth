import { motion } from "framer-motion";
import workshops from "@/data/workshops.json";
import { Calendar, MapPin, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

type Workshop = {
  month: string;
  title: string;
  date: string | null;
  location: string;
};

type WorkshopStatus = "upcoming" | "coming-soon" | "finished";

type WorkshopWithStatus = Workshop & {
  status: WorkshopStatus;
  isNext: boolean;
};

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Coming Soon";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Coming Soon";
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getWorkshopStatus(workshop: Workshop, now: Date): { status: WorkshopStatus; isNext: boolean } {
  if (!workshop.date) {
    return { status: "coming-soon", isNext: false };
  }
  
  const eventDate = new Date(workshop.date);
  if (isNaN(eventDate.getTime())) {
    return { status: "coming-soon", isNext: false };
  }
  
  if (eventDate < now) {
    return { status: "finished", isNext: false };
  }
  
  return { status: "upcoming", isNext: false };
}

function getNextUpcomingWorkshop(workshops: Workshop[], now: Date): Workshop | null {
  const upcoming = workshops
    .filter(w => w.date && new Date(w.date) > now)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
  
  return upcoming.length > 0 ? upcoming[0] : null;
}

function EventCard({ workshop, index }: { workshop: WorkshopWithStatus; index: number }) {
  const getStatusColor = () => {
    switch (workshop.status) {
      case "upcoming":
        return workshop.isNext 
          ? "border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg shadow-primary/10" 
          : "border-primary/20 bg-gradient-to-br from-primary/3 to-accent/3";
      case "coming-soon":
        return "border-muted/30 bg-muted/5";
      case "finished":
        return "border-muted/20 bg-muted/10 opacity-60";
      default:
        return "border-border";
    }
  };

  const getStatusIcon = () => {
    switch (workshop.status) {
      case "upcoming":
        return <Clock className="w-4 h-4 text-primary" />;
      case "coming-soon":
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
      case "finished":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (workshop.status) {
      case "upcoming":
        return workshop.isNext ? "Next Up" : "Upcoming";
      case "coming-soon":
        return "Coming Soon";
      case "finished":
        return "Finished";
      default:
        return "";
    }
  };

  return (
    <motion.article
      key={`${workshop.month}-${index}`}
      variants={item}
      transition={{ duration: 0.5 }}
      className={`group relative rounded-3xl p-6 border transition-all duration-300 hover:scale-105 ${getStatusColor()}`}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {workshop.isNext && (
        <motion.div
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          NEXT
        </motion.div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 text-primary/80">
            {getStatusIcon()}
            <span className="text-xs font-medium uppercase tracking-wider">{workshop.month}</span>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            workshop.status === "upcoming" 
              ? "bg-primary/10 text-primary" 
              : workshop.status === "finished"
              ? "bg-green-100 text-green-700"
              : "bg-muted text-muted-foreground"
          }`}>
            {getStatusText()}
          </span>
        </div>
        
        <h3 className={`text-xl font-bold mb-3 ${
          workshop.status === "finished" ? "text-muted-foreground" : "text-foreground"
        }`}>
          {workshop.title}
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className={workshop.status === "finished" ? "text-muted-foreground" : "text-muted-foreground"}>
              {formatDate(workshop.date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className={workshop.status === "finished" ? "text-muted-foreground" : "text-muted-foreground"}>
              {workshop.location}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Events() {
  const [workshopsWithStatus, setWorkshopsWithStatus] = useState<WorkshopWithStatus[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const workshopsData = workshops as Workshop[];
    const nextUpcoming = getNextUpcomingWorkshop(workshopsData, now);
    
    const workshopsWithStatus = workshopsData.map(workshop => {
      const { status, isNext } = getWorkshopStatus(workshop, now);
      return {
        ...workshop,
        status,
        isNext: nextUpcoming ? workshop.month === nextUpcoming.month && workshop.title === nextUpcoming.title : false
      };
    });
    
    setWorkshopsWithStatus(workshopsWithStatus);
  }, [now]);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Monthly workshop schedule with real-time status updates
          </p>
          
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span className="text-muted-foreground">Coming Soon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Finished</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {workshopsWithStatus.map((workshop, idx) => (
            <EventCard key={`${workshop.month}-${idx}`} workshop={workshop} index={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}


