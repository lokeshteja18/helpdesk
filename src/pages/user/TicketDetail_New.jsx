import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ticketAPI } from '../../services/api';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [posting, setPosting] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getById(id);
      setTicket(response.data.data);
    } catch (err) {
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setPosting(true);
    try {
      await ticketAPI.addNote(id, user._id, newNote);
      setNewNote('');
      fetchTicket(); // Refresh to show new note
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="loading">Loading ticket...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  const getStatusBadgeColor = (status) => {
    const colors = {
      'open': '#ff6b6b',
      'in-progress': '#ffd93d',
      'on-hold': '#6c5ce7',
      'resolved': '#74b9ff',
      'closed': '#00b894'
    };
    return colors[status] || '#95a5a6';
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      'low': '#00b894',
      'medium': '#ffd93d',
      'high': '#ff6b6b',
      'critical': '#d63031'
    };
    return colors[priority] || '#95a5a6';
  };

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-header">
        <h2>{ticket.title}</h2>
        <div className="ticket-info-badges">
          <span className="badge ticket-number">#{ticket.ticketNumber}</span>
          <span 
            className="badge" 
            style={{ backgroundColor: getStatusBadgeColor(ticket.status) }}
          >
            {ticket.status.toUpperCase()}
          </span>
          <span 
            className="badge" 
            style={{ backgroundColor: getPriorityBadgeColor(ticket.priority) }}
          >
            {ticket.priority.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="ticket-detail-content">
        <div className="ticket-section">
          <h3>Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Category:</label>
              <p>{ticket.category}</p>
            </div>
            <div className="detail-item">
              <label>Created:</label>
              <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div className="detail-item">
              <label>Last Updated:</label>
              <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
            <div className="detail-item">
              <label>Assigned To:</label>
              <p>{ticket.assignedTo ? ticket.assignedTo.name : 'Not assigned'}</p>
            </div>
          </div>
        </div>

        <div className="ticket-section">
          <h3>Description</h3>
          <div className="description-box">
            <p>{ticket.description}</p>
          </div>
        </div>

        {ticket.notes && ticket.notes.length > 0 && (
          <div className="ticket-section">
            <h3>Notes & Updates ({ticket.notes.length})</h3>
            <div className="notes-list">
              {ticket.notes.map((note, idx) => (
                <div key={idx} className="note-item">
                  <div className="note-header">
                    <strong>{note.agentId?.name || 'Agent'}</strong>
                    <small>{new Date(note.createdAt).toLocaleString()}</small>
                  </div>
                  <p>{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {ticket.status !== 'closed' && (
          <div className="ticket-section">
            <h3>Add Note</h3>
            <form onSubmit={handleAddNote} className="add-note-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type your update or question..."
                rows="3"
                disabled={posting}
              ></textarea>
              <button type="submit" disabled={posting || !newNote.trim()}>
                {posting ? 'Posting...' : 'Add Note'}
              </button>
            </form>
          </div>
        )}

        {ticket.status === 'closed' && ticket.resolution && (
          <div className="ticket-section resolution">
            <h3>✅ Resolution</h3>
            <p>{ticket.resolution}</p>
            {ticket.rating && (
              <div>
                <p>Rating: {'⭐'.repeat(ticket.rating)}</p>
                {ticket.feedback && <p>Feedback: {ticket.feedback}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
