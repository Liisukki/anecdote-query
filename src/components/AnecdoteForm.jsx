import { useState } from 'react'

const AnecdoteForm = ({ onCreate }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (content.length < 5) {
      alert('Anecdote must be at least 5 characters long!')
      return
    }
    onCreate({ content, votes: 0 }) // Lähetetään palvelimelle
    setContent('') // Tyhjennetään input
  }

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
  )
}

export default AnecdoteForm
