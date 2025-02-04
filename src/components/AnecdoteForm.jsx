import { useState } from 'react';
import { useNotification } from '../NotificationContext';

const AnecdoteForm = ({ onCreate }) => {
  const [content, setContent] = useState('');
  const { setNotification } = useNotification();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (content.length < 5) {
      setNotification('Anecdote must be at least 5 characters long!');
      return;
    }
    onCreate({ content, votes: 0 });
    setContent('');
    setNotification(`Anecdote '${content}' created!`);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <input 
          name='anecdote' 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
