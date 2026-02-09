import { useState, useEffect } from 'react';
import { ticketAPI } from '../../services/api';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (filterStatus === 'all') {
        response = await ticketAPI.getUserTickets(user._id);
      } else {
        response = await ticketAPI.getByStatus(filterStatus);
        // Filter by current user
        response.data.data = response.data.data.filter(t => t.userId._id === user._id);
      }
      
      setTickets(response.data.data || []);
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#ff6b6b',
      'in-progress': '#ffd93d',
      'on-hold': '#6c5ce7',
      'resolved': '#74b9ff',
      'closed': '#00b894'
    };
    return colors[status] || '#95a5a6';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#00b894',
      'medium': '#ffd93d',
      'high': '#ff6b6b',
      'critical': '#d63031'
    };
    return colors[priority] || '#95a5a6';
  };

  if (loading) return <div className="loading">Loading your tickets...</div>;

  return (
    <div className="my-tickets">
      <div className="tickets-header">
        <h2>My Tickets ({tickets.length})</h2>
        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="tickets-table">
          <table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td><strong>{ticket.ticketNumber}</strong></td>
                  <td>{ticket.title}</td>
                  <td><span className="badge">{ticket.category}</span></td>
                  <td>
                    <span 
                      className="badge priority" 
                      style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="badge status" 
                      style={{ backgroundColor: getStatusColor(ticket.status) }}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <a href={`/user/tickets/${ticket._id}`} className="btn-small">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
