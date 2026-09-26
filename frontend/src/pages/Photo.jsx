import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Photo() {
  const navigate = useNavigate();
  const location = useLocation();
  const photoNumber = location.state?.photoNumber || "0000";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md text-center"
    >
      <Card className="border-border shadow-2xl shadow-primary/10">
        <CardHeader>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto rounded-full bg-primary/10 p-4 mb-4"
          >
            <Camera className="w-12 h-12 text-primary" />
          </motion.div>
          <CardTitle className="text-3xl font-extrabold text-foreground mb-2">Photo Time!</CardTitle>
          <CardDescription className="text-lg text-muted">
            Please take a photo of this 4-digit number.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 flex justify-center">
          <div className="bg-secondary/30 rounded-2xl p-6 border-2 border-primary/20 shadow-inner">
            <span className="text-6xl font-black text-primary tracking-widest">{photoNumber}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full text-lg h-14 font-semibold" 
            onClick={() => navigate('/finish')}
          >
            We Took The Photo!
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
