import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

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
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

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
      members: [...editingTeam.members, { name: '', university_id: '', certificate_name: '', member_email: '' }]
    });
  };

  const removeMember = (index) => {
    const newMembers = [...editingTeam.members];
    newMembers.splice(index, 1);
    setEditingTeam({ ...editingTeam, members: newMembers });
  };

  const handleResetDatabase = async () => {
    if (window.confirm("Are you sure you want to reset all certificate details? Team names will not be deleted.")) {
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
    const teamUniversity = r.member_id?.team_id?.university || 'N/A';
    if (!teamStatsMap[teamName]) {
      teamStatsMap[teamName] = { 
        id: teamId,
        name: teamName, 
        university: teamUniversity,
        members: []
      };
    }
    teamStatsMap[teamName].members.push({
      id: r.member_id?._id,
      name: r.member_id?.name,
      university_id: r.member_id?.university_id || '',
      certificate_name: r.certificate_name,
      member_email: r.member_email,
    });
  });
  
  const teamStats = Object.values(teamStatsMap);
  const totalTeams = teamStats.length;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post('/api/admin/login', { username, password });
      if (res.data.success) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setLoginError('Invalid username or password');
      } else {
        setLoginError('An error occurred during login');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4 py-12 mx-auto"
      >
        <Card className="border-border shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && <p className="text-destructive text-sm text-center font-medium">{loginError}</p>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 pr-10 rounded-md border border-input bg-background text-foreground"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 mt-4">Login</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Admin Dashboard</h1>
          <p className="text-muted mt-1">Real-time certificate details collection by team</p>
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={handleResetDatabase}>
            Reset Database
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return to Certificate Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="border-border shadow-xl shadow-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted text-xs font-semibold uppercase tracking-wider">Total Teams</CardTitle>
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

      </div>

      <Card className="border-border shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Certificate Submission Log</CardTitle>
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
                    <th className="pb-3 px-4 font-semibold">University</th>
                    <th className="pb-3 px-4 font-semibold">Member Name</th>
                    <th className="pb-3 px-4 font-semibold">University ID</th>
                    <th className="pb-3 px-4 font-semibold">Certificate Name</th>
                    <th className="pb-3 px-4 font-semibold">Email</th>
                    <th className="pb-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {teamStats.map((team, i) => (
                    <React.Fragment key={i}>
                      {team.members.map((m, j) => (
                        <tr key={`${i}-${j}`} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                          {j === 0 && (
                            <td className="py-3 px-4 font-bold text-foreground align-middle border-r border-border/10" rowSpan={team.members.length}>
                              {team.name}
                            </td>
                          )}
                          {j === 0 && (
                            <td className="py-3 px-4 font-medium text-muted-foreground align-middle border-r border-border/10" rowSpan={team.members.length}>
                              {team.university}
                            </td>
                          )}
                          <td className="py-3 px-4 font-medium">{m.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{m.university_id || 'N/A'}</td>
                          <td className="py-3 px-4">{m.certificate_name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{m.member_email}</td>
                          {j === 0 && (
                            <td className="py-3 px-4 text-center align-middle border-l border-border/10" rowSpan={team.members.length}>
                              {team.id ? (
                                <Button variant="outline" size="sm" onClick={() => handleEditTeam(team.id)}>Edit Team</Button>
                              ) : (
                                <span className="text-muted text-xs">N/A</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {teamStats.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-muted text-lg">No teams have submitted yet!</td>
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
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted">University</label>
                    <input 
                      type="text" 
                      value={editingTeam.team.university || ''} 
                      onChange={(e) => setEditingTeam({ ...editingTeam, team: { ...editingTeam.team, university: e.target.value } })}
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
                          className="flex-1 p-2 rounded-md border border-input bg-background text-foreground min-w-0"
                        />
                        <input 
                          type="text" 
                          value={member.university_id || ''}
                          onChange={(e) => handleMemberChange(i, 'university_id', e.target.value)}
                          placeholder="University ID"
                          className="flex-1 p-2 rounded-md border border-input bg-background text-foreground min-w-0"
                        />
                        <input 
                          type="text" 
                          value={member.certificate_name}
                          onChange={(e) => handleMemberChange(i, 'certificate_name', e.target.value)}
                          placeholder="Certificate Name"
                          className="flex-1 p-2 rounded-md border border-input bg-background text-foreground min-w-0"
                        />
                        <input 
                          type="email" 
                          value={member.member_email}
                          onChange={(e) => handleMemberChange(i, 'member_email', e.target.value)}
                          placeholder="Email"
                          className="flex-1 p-2 rounded-md border border-input bg-background text-foreground min-w-0"
                        />
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
