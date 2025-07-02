import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export function CodeVerification() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ''; // Get email from location state

  const verifyCodeMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid code or email');
      }
      return response.json();
    },
    onSuccess: () => {
      alert('Code verified! Redirecting to home.');
      navigate('/'); // Redirect to home on success
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code && email) {
      verifyCodeMutation.mutate(code);
    } else if (!email) {
      alert('Email not found. Please go back to the authentication page.');
      navigate('/auth'); // Redirect back to auth if no email
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Verify Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">4-Digit Code</Label>
                <Input
                  id="code"
                  placeholder="Enter the code from your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
              <Button type="submit" disabled={verifyCodeMutation.isPending}>
                {verifyCodeMutation.isPending ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
