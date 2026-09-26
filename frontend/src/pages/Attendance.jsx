import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';

export default function Attendance() {
  const { teamId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [presentIds, setPresentIds] = useState(new Set());
  const teamName = location.state?.teamName || "Your Team";

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`/api/teams/${teamId}/members`);
        setMembers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMembers();
  }, [teamId]);

  const togglePresence = (id) => {
    const newSet = new Set(presentIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size >= 4) return; // Maximum 4 members allowed
      newSet.add(id);
    }
    setPresentIds(newSet);
  };

  const handleContinue = () => {
    const presentMembers = members.filter(m => presentIds.has(m.id));
    navigate(`/food/${teamId}`, { state: { presentMembers, teamName } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full max-w-md"
    >
      <Card className="border-border shadow-xl shadow-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Attendance</CardTitle>
          <CardDescription className="text-muted">
            Who is present today from <span className="font-semibold text-primary">{teamName}</span>?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {members.map((member) => {
              const isPresent = presentIds.has(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => togglePresence(member.id)}
                  className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer border transition-all ${
                    isPresent
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-background border-border hover:bg-secondary/10'
                  }`}
                >
                  <Checkbox 
                    checked={isPresent}
                    onCheckedChange={() => togglePresence(member.id)}
                    id={`member-${member.id}`}
                    className={isPresent ? 'border-primary' : 'border-muted-foreground'}
                  />
                  <label 
                    htmlFor={`member-${member.id}`}
                    className={`font-medium cursor-pointer ${isPresent ? 'text-primary' : 'text-foreground'}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {member.name}
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full text-md h-12" 
            disabled={presentIds.size === 0} 
            onClick={handleContinue}
          >
            Continue with {presentIds.size} Member{presentIds.size !== 1 && 's'}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
