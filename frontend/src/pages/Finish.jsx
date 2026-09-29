import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export default function Finish() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate back to Onboard after 4 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm text-center"
    >
      <Card className="border-border shadow-2xl shadow-primary/10 bg-gradient-to-b from-background to-secondary/10">
        <CardContent className="pt-10 pb-8 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="rounded-full bg-primary/10 p-4 mb-6"
          >
            <CheckCircle className="w-16 h-16 text-primary" />
          </motion.div>
          <CardTitle className="text-3xl font-extrabold text-foreground mb-2">Thank You!</CardTitle>
          <CardDescription className="text-muted text-base">
            Your team's attendance and certificate details have been recorded.
          </CardDescription>
          
          <div className="mt-8 text-sm text-muted/70 flex items-center justify-center space-x-2">
            <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            <span>Returning to home page...</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
