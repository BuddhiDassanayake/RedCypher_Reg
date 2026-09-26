import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function Admin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleEditTeam = async (teamId) => {
    setIsEditing(true);
    setEditLoading(true);
    try {
      const res = await axios.get(`/api/admin/team/${teamId}`);
      setEditingTeam(res.data);
    } catch(err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaveLoading(true);
    try {
       await axios.put(`/api/admin/team/${editingTeam.team.id}`, {
          name: editingTeam.team.name,
          members: editingTeam.members
       });
       setIsEditing(false);
       setEditingTeam(null);
       fetchStats();
    } catch(err) {
       console.error(err);
    } finally {
       setSaveLoading(false);
    }
  };

  const handleTeamNameChange = (e) => {
    setEditingTeam({ ...editingTeam, team: { ...editingTeam.team, name: e.target.value } });
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...editingTeam.members];
    newMembers[index][field] = value;
    setEditingTeam({ ...editingTeam, members: newMembers });
  };

  const addMember = () => {
    setEditingTeam({
      ...editingTeam,
      members: [...editingTeam.members, { name: '', food_choice: 'None' }]
    });
  };

  const removeMember = (index) => {
    const newMembers = [...editingTeam.members];
    newMembers.splice(index, 1);
    setEditingTeam({ ...editingTeam, members: newMembers });
  };

  const handleResetDatabase = async () => {
    if (window.confirm("Are you sure you want to reset all attendance and food selections? Team names will not be deleted.")) {
      try {
        setLoading(true);
        await axios.post('/api/admin/reset');
        fetchStats();
      } catch (err) {
        console.error("Reset failed", err);
        setLoading(false);
      }
    }
  };

  // Compute team-based stats
  const teamStatsMap = {};
  records.forEach(r => {
    const teamName = r.member_id?.team_id?.name || 'Unknown Team';
    const teamId = r.member_id?.team_id?.id || null;
    if (!teamStatsMap[teamName]) {
      teamStatsMap[teamName] = { 
        id: teamId,
        name: teamName, 
        membersPresent: 0, 
        veg: 0, 
        chicken: 0, 
        none: 0,
        photoNumber: r.member_id?.team_id?.photo_number || 'N/A'
      };
    }
    teamStatsMap[teamName].membersPresent += 1;
    if (r.food_choice === 'Veg') teamStatsMap[teamName].veg += 1;
    if (r.food_choice === 'Chicken') teamStatsMap[teamName].chicken += 1;
    if (r.food_choice === 'None') teamStatsMap[teamName].none += 1;
  });
  
  const teamStats = Object.values(teamStatsMap);
  const totalTeams = teamStats.length;
  const totalVeg = records.filter(r => r.food_choice === 'Veg').length;
  const totalChicken = records.filter(r => r.food_choice === 'Chicken').length;
  const totalNone = records.filter(r => r.food_choice === 'None').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Admin Dashboard</h1>
          <p className="text-muted mt-1">Real-time attendance and food selection metrics by team</p>
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={handleResetDatabase}>
            Reset Database
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return to Check-in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <Card className="border-border shadow-xl shadow-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted text-xs font-semibold uppercase tracking-wider">Teams Arrived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-foreground">{totalTeams}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xl shadow-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted text-xs font-semibold uppercase tracking-wider">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-foreground">{records.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">🥗</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted text-xs font-semibold uppercase tracking-wider">Veg Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-emerald-500">{totalVeg}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">🍗</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted text-xs font-semibold uppercase tracking-wider">Chicken Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-amber-500">{totalChicken}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">🚫</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted text-xs font-semibold uppercase tracking-wider">No Food</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-slate-500">{totalNone}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Team Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-border text-muted text-sm">
                    <th className="pb-3 px-4 font-semibold">Team Name</th>
                    <th className="pb-3 px-4 font-semibold text-center">Members Present</th>
                    <th className="pb-3 px-4 font-semibold text-center">Veg Required</th>
                    <th className="pb-3 px-4 font-semibold text-center">Chicken Required</th>
                    <th className="pb-3 px-4 font-semibold text-center">No Food</th>
                    <th className="pb-3 px-4 font-semibold text-center">Photo No.</th>
                    <th className="pb-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {teamStats.map((team, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground text-lg">{team.name}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                          {team.membersPresent}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          team.veg > 0 ? 'bg-emerald-500/15 text-emerald-500' : 'text-muted/50'
                        }`}>
                          {team.veg}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          team.chicken > 0 ? 'bg-amber-500/15 text-amber-500' : 'text-muted/50'
                        }`}>
                          {team.chicken}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          team.none > 0 ? 'bg-slate-500/15 text-slate-400' : 'text-muted/50'
                        }`}>
                          {team.none}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-lg text-primary tracking-wider">
                        {team.photoNumber}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {team.id ? (
                           <Button variant="outline" size="sm" onClick={() => handleEditTeam(team.id)}>Edit</Button>
                        ) : (
                           <span className="text-muted text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {teamStats.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-muted text-lg">No teams have checked in yet!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-bold text-foreground">Edit Team</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Close</Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {editLoading ? (
                <div className="flex justify-center items-center py-12">
                  <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
                </div>
              ) : editingTeam ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted">Team Name</label>
                    <input 
                      type="text" 
                      value={editingTeam.team.name} 
                      onChange={handleTeamNameChange}
                      className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-muted">Members</label>
                      <Button variant="outline" size="sm" onClick={addMember}>+ Add Member</Button>
                    </div>
                    {editingTeam.members.map((member, i) => (
                      <div key={i} className="flex gap-2 items-center p-3 rounded-lg border border-border bg-muted/10">
                        <input 
                          type="text" 
                          value={member.name}
                          onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                          placeholder="Member Name"
                          className="flex-1 p-2 rounded-md border border-input bg-background text-foreground"
                        />
                        <select 
                          value={member.food_choice}
                          onChange={(e) => handleMemberChange(i, 'food_choice', e.target.value)}
                          className="p-2 rounded-md border border-input bg-background text-foreground"
                        >
                          <option value="Veg">Veg</option>
                          <option value="Chicken">Chicken</option>
                          <option value="None">None</option>
                        </select>
                        <Button variant="destructive" size="sm" onClick={() => removeMember(i)}>Remove</Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted py-8">Failed to load team data.</div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saveLoading}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={saveLoading || editLoading}>
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
