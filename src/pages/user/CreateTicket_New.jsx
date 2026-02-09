import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../../services/api';

export default function CreateTicket() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await ticketAPI.create(
        formData.title,
        formData.description,
        formData.category,
        formData.priority,
        user._id
      );
      
      setSuccess(`✅ Ticket created! Ticket #: ${response.data.data.ticketNumber}`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'technical',
        priority: 'medium'
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/user/tickets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-box">
        <h2>Create New Support Ticket</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              maxLength="100"
              disabled={loading}
              required
            />
            <small>{formData.title.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your issue..."
              rows="6"
              maxLength="1000"
              disabled={loading}
              required
            ></textarea>
            <small>{formData.description.length}/1000</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select 
                id="category"
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                disabled={loading}
              >
                <option value="account">Account</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="feature-request">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority Level</label>
              <select 
                id="priority"
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                disabled={loading}
              >
                <option value="low">Low - Can wait</option>
                <option value="medium">Medium - Normal</option>
                <option value="high">High - Urgent</option>
                <option value="critical">Critical - Emergency</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Ticket...' : 'Create Ticket'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/user/tickets')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
