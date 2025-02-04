import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { NotificationProvider, useNotification } from './NotificationContext';

const getAnecdotes = async () => {
  const { data } = await axios.get('http://localhost:3001/anecdotes');
  return data;
};

const createAnecdote = async (newAnecdote) => {
  const { data } = await axios.post('http://localhost:3001/anecdotes', newAnecdote);
  return data;
};

const updateAnecdote = async (anecdote) => {
  const { data } = await axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote);
  return data;
};

const AppContent = () => {
  const queryClient = useQueryClient();
  const { setNotification } = useNotification();

  const { data: anecdotes, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  });

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData) => [...oldData, newAnecdote]);
      setNotification(`Anecdote '${newAnecdote.content}' created!`);
    }
  });

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData) =>
        oldData.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)
      );
      setNotification(`Anecdote '${updatedAnecdote.content}' received a vote!`);
    }
  });

  if (isLoading) return <div>loading data...</div>;
  if (error) return <div>anecdote service not available due to problems in server</div>;

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
  );
};

const App = () => (
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
);

export default App;
