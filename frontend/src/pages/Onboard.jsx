import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';

export default function Onboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (!searchTerm.trim()) {
        setTeams([]);
        return;
      }
      try {
        const res = await axios.get('/api/teams', { params: { q: searchTerm } });
        setTeams(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const timeoutId = setTimeout(fetchTeams, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleContinue = () => {
    if (selectedTeam) {
      navigate(`/certificate/${selectedTeam.id}`, { state: { teamName: selectedTeam.name } });
    }
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
          <div className="mx-auto bg-secondary/30 p-3 rounded-full mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Find Your Team</CardTitle>
          <CardDescription className="text-muted">
            Search and select your team to begin the registration process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <Input
              placeholder="Search team name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedTeam(null);
              }}
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {searchTerm.trim() === '' ? (
              <p className="text-center text-sm text-muted py-4">Start typing to find your team...</p>
            ) : teams.length > 0 ? (
              teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => {
                    if (team.has_checked_in) return;
                    setSelectedTeam(team);
                    setSearchTerm(team.name);
                  }}
                  className={`p-3 rounded-md transition-all border flex justify-between items-center ${
                    team.has_checked_in
                      ? 'opacity-50 cursor-not-allowed bg-secondary/5 border-transparent text-muted'
                      : selectedTeam?.id === team.id
                        ? 'bg-primary/10 border-primary text-primary font-medium cursor-pointer'
                        : 'border-transparent hover:bg-secondary/20 hover:border-border text-foreground cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{team.name}</span>
                    {team.university && <span className="text-xs opacity-75">{team.university}</span>}
                  </div>
                  {team.has_checked_in && (
                    <span className="text-xs font-semibold bg-secondary/50 text-muted-foreground px-2 py-1 rounded-full">
                      Submitted
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted py-4">No teams found</p>
            )}
          </div>

          <Button 
            className="w-full text-md h-12 mt-4" 
            disabled={!selectedTeam} 
            onClick={handleContinue}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
