import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import useCountdown from "@/hooks/useCountdown";

const Hero = () => {
  const { days, hours, minutes, seconds, nextWorkshop } = useCountdown();

  const scrollToForm = () => {
    document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-accent/5" />
      
      
      {/* Subtle animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-sm sm:text-base font-medium text-muted-foreground mb-4 tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Presented by Niche Of Truth
          </motion.p>
          
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            One Year
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Da'wa Workshop
            </span>
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Join us every 1st Sunday for a transformative learning experience.
            Comprehensive study materials, lunch, and refreshments included.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-center mb-3">
              <motion.p 
                className="text-lg sm:text-xl font-bold mb-3 text-foreground"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Next Workshop starts in:
              </motion.p>
              {nextWorkshop?.title && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full border border-primary/20">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    {nextWorkshop.title}
                  </span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {[
                { label: "Days", value: days },
                { label: "Hours", value: hours },
                { label: "Minutes", value: minutes },
                { label: "Seconds", value: seconds },
              ].map((item, idx, arr) => (
                <div key={item.label} className="flex items-center">
                  <div className="text-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={item.value}
                        initial={{ rotateX: -90, opacity: 0, y: -8 }}
                        animate={{ rotateX: 0, opacity: 1, y: 0 }}
                        exit={{ rotateX: 90, opacity: 0, y: 8 }}
                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight tabular-nums"
                      >
                        {item.value}
                      </motion.div>
                    </AnimatePresence>
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                  {idx < arr.length - 1 && (
                    <motion.span
                      aria-hidden
                      className="mx-3 sm:mx-4 text-primary/70 text-4xl sm:text-5xl font-bold animate-pulse"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      :
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>


          
          
          <motion.button
            onClick={scrollToForm}
            className="group relative inline-flex items-center gap-2 px-8 py-4 text-base sm:text-lg font-semibold text-primary-foreground bg-primary rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0]
            }}
            transition={{ 
              delay: 0.7, 
              duration: 0.8,
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Register Now</span>
            <ArrowDown className="w-5 h-5 relative z-10 group-hover:translate-y-0.5 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_infinite]" />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
