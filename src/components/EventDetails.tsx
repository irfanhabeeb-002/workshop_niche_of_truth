import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, IndianRupee, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

const EventDetails = () => {
  const [nextDate, setNextDate] = useState("");

  useEffect(() => {
    const calculateNextWorkshopDate = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // November 2025 is on 9th
      if (currentMonth === 10 && currentYear === 2025) {
        const novemberDate = new Date(2025, 10, 9);
        if (novemberDate >= now) {
          setNextDate("9 Nov 2025");
          return;
        }
      }
      
      // Start checking from current month
      let checkDate = new Date(currentYear, currentMonth, 1);
      
      // Find first Sunday of current month
      while (checkDate.getDay() !== 0) {
        checkDate.setDate(checkDate.getDate() + 1);
      }
      
      // If first Sunday has passed, get next month's first Sunday
      if (checkDate < now) {
        checkDate = new Date(currentYear, currentMonth + 1, 1);
        while (checkDate.getDay() !== 0) {
          checkDate.setDate(checkDate.getDate() + 1);
        }
      }
      
      const day = checkDate.getDate();
      const month = checkDate.toLocaleString('default', { month: 'short' });
      const year = checkDate.getFullYear();
      
      setNextDate(`${day} ${month} ${year}`);
    };

    calculateNextWorkshopDate();
    // Update daily
    const interval = setInterval(calculateNextWorkshopDate, 86400000);
    return () => clearInterval(interval);
  }, []);

  const details = [
    {
      icon: Calendar,
      label: "Schedule",
      value: "Every 1st Sunday",
      subtitle: nextDate || "Monthly sessions",
    },
    {
      icon: Clock,
      label: "Time",
      value: "10:10 AM – 4:00 PM",
      subtitle: "Full day workshop",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: "Ernakulam",
      subtitle: "Kerala",
    },
    {
      icon: Users,
      label: "Age Limit",
      value: "18 and above",
      subtitle: "Open for all genders",
    },
    {
      icon: IndianRupee,
      label: "Fees",
      value: "₹1000 - ₹2000",
      subtitle: "Students / Adults per year",
    },
    {
      icon: BookOpen,
      label: "Includes",
      value: "Study Materials",
      subtitle: "Lunch & Refreshments",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Event Details
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the workshop
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                whileHover={{
                  y: -8,
                }}
                className="group relative bg-card rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-300"
                style={{
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">
                    {detail.label}
                  </p>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {detail.value}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {detail.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
