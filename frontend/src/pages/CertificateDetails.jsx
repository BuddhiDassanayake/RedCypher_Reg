import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function CertificateDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const teamName = location.state?.teamName || "";
  
  // State maps member id to their certificate details
  const [presentMembers, setPresentMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`/api/teams/${teamId}/members`);
        setPresentMembers(res.data);
        
        const initial = {};
        res.data.forEach(m => {
          initial[m.id] = { certificateName: m.certificate_name || '', memberEmail: m.member_email || '' };
        });
        setSelections(initial);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [teamId]);

  const handleChange = (memberId, field, value) => {
    setSelections(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value
      }
    }));
  };


  const allFilled = presentMembers.length > 0 && presentMembers.every(m => 
    selections[m.id]?.certificateName?.trim() && selections[m.id]?.memberEmail?.trim()
  );

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const payload = presentMembers.map(m => ({
        memberId: m.id,
        certificateName: selections[m.id].certificateName,
        memberEmail: selections[m.id].memberEmail
      }));
      const response = await axios.post('/api/attendance', { teamId, selections: payload });
      navigate('/finish');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
      </div>
    );
  }

  if (presentMembers.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted">No members found for this team.</p>
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
          <CardTitle className="text-2xl font-bold text-foreground">Certificate Details</CardTitle>
          <CardDescription className="text-muted">
            Provide details for the certificates for members of <span className="font-semibold text-primary">{teamName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {presentMembers.map((member) => (
            <div key={member.id} className="p-4 rounded-xl border border-border bg-background shadow-sm space-y-3">
              <h4 className="font-medium text-lg text-foreground">{member.name}</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={`Certificate Name (e.g. ${member.name})`}
                  value={selections[member.id]?.certificateName || ''}
                  onChange={(e) => handleChange(member.id, 'certificateName', e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={selections[member.id]?.memberEmail || ''}
                  onChange={(e) => handleChange(member.id, 'memberEmail', e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-4 border-t border-border/50 flex flex-col space-y-2">
          <Button 
            className="w-full text-md h-12" 
            disabled={!allFilled || isSubmitting} 
            onClick={handleFinish}
          >
            {isSubmitting ? 'Saving...' : 'Submit Details'}
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
