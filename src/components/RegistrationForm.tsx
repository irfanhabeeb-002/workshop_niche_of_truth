import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    district: "",
    phone: "",
    whatsapp: "",
    previousParticipant: "",
    designation: "",
    paymentMode: "",
  });

  const keralaDistricts = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.age || !formData.sex || !formData.district || 
        !formData.phone || !formData.previousParticipant || !formData.designation || 
        !formData.paymentMode) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitUrl = import.meta.env.VITE_SUBMIT_URL || "https://example.com/submit";
      
      // Add timestamp in D/M/YYYY format
      const now = new Date();
      const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-2xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300";
  const labelClasses = "block text-sm font-semibold text-foreground mb-2";

  return (
    <section id="registration" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Register Now
          </h2>
          <p className="text-lg text-muted-foreground">
            Secure your spot for the next workshop
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl p-8 sm:p-12 border border-border"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="age" className={labelClasses}>
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      required
                      min="18"
                      value={formData.age}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="18+"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Sex *</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sex"
                          value="Male"
                          checked={formData.sex === "Male"}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sex"
                          value="Female"
                          checked={formData.sex === "Female"}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">Female</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="district" className={labelClasses}>
                    District *
                  </label>
                  <select
                    id="district"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">Select your district</option>
                    {keralaDistricts.map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      Phone No. *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="10 digit number"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className={labelClasses}>
                      WhatsApp No.
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      pattern="[0-9]{10}"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Previous participation in Niche of Truth events? *
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="previousParticipant"
                        value="Yes"
                        checked={formData.previousParticipant === "Yes"}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="previousParticipant"
                        value="No"
                        checked={formData.previousParticipant === "No"}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Any designations in Da'wa organizations? *
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="designation"
                        value="Yes"
                        checked={formData.designation === "Yes"}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="designation"
                        value="No"
                        checked={formData.designation === "No"}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Payment Mode *
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="Bank Transfer"
                        checked={formData.paymentMode === "Bank Transfer"}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">Bank Transfer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="UPI"
                        checked={formData.paymentMode === "UPI"}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-foreground">UPI</span>
                    </label>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-card rounded-3xl p-12 sm:p-16 border border-border text-center"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </motion.div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Registration Successful!
              </h3>
              
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for registering. We'll send you the details shortly.
              </p>
              
              <motion.a
                href="https://wa.me/917034137777?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
              >
                Join WhatsApp Group
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RegistrationForm;
