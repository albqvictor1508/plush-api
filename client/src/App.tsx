import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { UserAuth } from './pages/UserAuth'
import { ChatList } from './pages/ChatList'
import { ChatView } from './pages/ChatView'
import { CodeVerification } from './pages/CodeVerification'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <Link to="/" className="font-bold text-2xl">Plush Chat</Link>
            <div>
              <Link to="/chats" className="mr-4 hover:underline">Chats</Link>
              <Link to="/auth" className="hover:underline">Login/Register</Link>
            </div>
          </nav>
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<UserAuth />} />
              <Route path="/chats" element={<ChatList />} />
              <Route path="/chat/:chatId" element={<ChatView />} />
              <Route path="/verify-code" element={<CodeVerification />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

function Home() {
  return (
    <div className="text-center p-8">
      <h1 className="text-5xl mb-4">Welcome to Plush Chat my guy!</h1>
      <p className="text-lg">Please login or register to start chatting.</p>
    </div>
  )
}

export default App
