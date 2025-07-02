import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { useNavigate } from 'react-router-dom'

export function UserAuth() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/auth/user/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        console.log(response);
        throw new Error(`ERROR TO CREATE USER`);
      }
      return response.json();
    },
    onSuccess: () => {
      alert('Code sent to your email!');
      navigate('/verify-code', { state: { email } });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      createUserMutation.mutate(username);
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create User / Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? 'Creating...' : 'Create User / Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
