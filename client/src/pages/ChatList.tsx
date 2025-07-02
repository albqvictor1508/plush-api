import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { ScrollArea } from '../components/ui/scroll-area'
import { Link } from 'react-router-dom'

interface Chat {
  id: string;
  name: string;
}

export function ChatList() {
  const queryClient = useQueryClient()
  const [newChatParticipantId, setNewChatParticipantId] = useState('');
  const [newChatName, setNewChatName] = useState('');

  const { data: chats, isLoading, error } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await fetch('/api/chats', { credentials: 'include' })
      if (!response.ok) {
        throw new Error('Failed to fetch chats')
      }
      const data = await response.json()
      console.log(data);
      return data;
    }
  })

  const createChatMutation = useMutation({
    mutationFn: async ({ title, participantId }: { participantId: string, title: string }) => {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title, participantId: participantId }),
      })
      if (!response.ok) {
        console.error(await response.json());
        throw new Error('Failed to create chat')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
      setNewChatName('')
      alert('Chat created!')
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    },
  })

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChatName && newChatParticipantId) {
      createChatMutation.mutate({ title: newChatName, participantId: newChatParticipantId });
    }
  }

  if (isLoading) return <div className="text-center">Loading chats...</div>
  if (error) return <div className="text-center text-red-500">Error loading chats: {error.message}</div>

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle>Your Chats</CardTitle>
        </CardHeader>
        <CardContent>
          {chats && chats.length > 0 ? (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {chats.map((chat) => (
                <Link to={`/chat/${chat.id}`} key={chat.id} className="block p-2 hover:bg-gray-100 rounded-md">
                  {chat.name}
                </Link>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500">No chats found. Create one!</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateChat}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="newChatName">Chat Name</Label>
                <Input
                  id="newChatName"
                  placeholder="Enter chat name"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  required
                />
                <Label htmlFor="newChatParticipantId">Chat Name</Label>
                <Input
                  id="newChatParticipantId"
                  placeholder="Enter participant ID"
                  value={newChatParticipantId}
                  onChange={(e) => setNewChatParticipantId(e.target.value)}
                  required
                />

              </div>
              <Button type="submit" disabled={createChatMutation.isPending}>
                {createChatMutation.isPending ? 'Creating...' : 'Create Chat'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
