import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

const FOOD_OPTIONS = ['Veg', 'Chicken', 'None'];

export default function FoodSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const presentMembers = location.state?.presentMembers || [];
  const teamName = location.state?.teamName || "";
  
  // State maps member id to their food choice
  const [selections, setSelections] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (memberId, foodChoice) => {
    setSelections(prev => ({ ...prev, [memberId]: foodChoice }));
  };

  const allSelected = presentMembers.length > 0 && presentMembers.every(m => selections[m.id]);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Extract teamId from the current URL to pass to the backend
      const currentTeamId = location.pathname.split('/').pop();
      
      const payload = presentMembers.map(m => ({
        memberId: m.id,
        foodChoice: selections[m.id]
      }));
      const response = await axios.post('/api/attendance', { teamId: currentTeamId, selections: payload });
      const { photoNumber } = response.data;
      navigate('/photo', { state: { photoNumber } });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (presentMembers.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted">No members present.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full max-w-lg"
    >
      <Card className="border-border shadow-xl shadow-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Food Selection</CardTitle>
          <CardDescription className="text-muted">
            Choose meals for the present members of <span className="font-semibold text-primary">{teamName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {presentMembers.map((member) => (
            <div key={member.id} className="p-4 rounded-xl border border-border bg-background shadow-sm space-y-3">
              <h4 className="font-medium text-lg text-foreground">{member.name}</h4>
              <div className="grid grid-cols-3 gap-3">
                {FOOD_OPTIONS.map(option => (
                  <Button
                    key={option}
                    variant={selections[member.id] === option ? "default" : "outline"}
                    onClick={() => handleSelect(member.id, option)}
                    className="w-full transition-all duration-200"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-4 border-t border-border/50 flex flex-col space-y-2">
          <Button 
            className="w-full text-md h-12" 
            disabled={!allSelected || isSubmitting} 
            onClick={handleFinish}
          >
            {isSubmitting ? 'Saving...' : 'Finish Selection'}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
