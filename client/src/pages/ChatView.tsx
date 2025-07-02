import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { ScrollArea } from '../components/ui/scroll-area'

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export function ChatView() {
  const { chatId } = useParams<{ chatId: string }>()
  const queryClient = useQueryClient()
  const [newMessageContent, setNewMessageContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, content }),
      })
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      const data = response.json()
      console.log(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] })
      setNewMessageContent('')
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    },
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessageContent && chatId) {
      sendMessageMutation.mutate(newMessageContent)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Chat: {chatId}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <form onSubmit={handleSendMessage} className="flex">
            <Input
              placeholder="Type your message..."
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              className="flex-grow mr-2"
              required
            />
            <Button type="submit" disabled={sendMessageMutation.isPending}>
              {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
