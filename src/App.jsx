import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

// ✅ Hakee kaikki anekdootit palvelimelta
const getAnecdotes = async () => {
  const { data } = await axios.get('http://localhost:3001/anecdotes')
  return data
}

// ✅ Lisää uuden anekdootin palvelimelle
const createAnecdote = async (newAnecdote) => {
  const { data } = await axios.post('http://localhost:3001/anecdotes', newAnecdote)
  return data
}

// ✅ Päivittää anekdootin äänimäärän palvelimella
const updateAnecdote = async (anecdote) => {
  const { data } = await axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote)
  return data
}

const App = () => {
  const queryClient = useQueryClient()

  // ✅ Hakee anekdootit palvelimelta
  const { data: anecdotes, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  // ✅ Lisää uuden anekdootin ja päivittää listan
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData) => [...oldData, newAnecdote])
    }
  })

  // ✅ Päivittää anekdootin äänimäärän ja päivittää listan
  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData) =>
        oldData.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)
      )
    }
  })

  if (isLoading) return <div>loading data...</div>
  if (error) return <div>anecdote service not available due to problems in server</div>

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm onCreate={newAnecdoteMutation.mutate} />
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
