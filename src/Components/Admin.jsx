import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee: '',
    date: '',
    image: null,
    rule: '',
    groupSize: 1 // New field for group size
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://iic-backend-lcp6.onrender.com//events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
        const response = await axios.get(`https://iic-backend-lcp6.onrender.com//events/${eventId}/participants`);
        setParticipants(response.data);
    } catch (error) {
        console.error('Error fetching participants', error);
    }
};

const groupParticipantsByGroupId = () => {
    return participants.reduce((acc, participant) => {
        if (!acc[participant.groupId]) {
            acc[participant.groupId] = { members: [], count: 0 };
        }
        acc[participant.groupId].members.push(participant);
        acc[participant.groupId].count += 1;
        return acc;
    }, {});
};

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleAddEvent = async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post('https://iic-backend-lcp6.onrender.com//upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchEvents();
      handleClose();
    } catch (error) {
      console.error('Error adding event', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`https://iic-backend-lcp6.onrender.com//delete/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event', error);
    }
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    fetchParticipants(eventId);
  };

  const handleDownloadCsv = async (eventId) => {
    try {
      const response = await axios.get(`https://iic-backend-lcp6.onrender.com//events/${eventId}/participants/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participants-${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV file', error);
    }
  };

  // Group

  const groupedParticipants = groupParticipantsByGroupId();

  return (
    <div>
      <h1>Admin</h1>
      <div>
        <Button onClick={handleShow}>Add Event</Button>
        <Button onClick={fetchEvents}>View Events</Button>
        <Button><Link to="/adminidea">Idehub</Link></Button>
      </div>

      <div className="mt-3">
        {events.map((event, index) => (
          <div key={event._id} className="event-item">
            {index > 0 ? <hr /> : null}
            <img src={`https://iic-backend-lcp6.onrender.com/file/${event.image}`} alt={event.name} style={{ width: '100px', height: '100px' }} />
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>{new Date(event.date).toDateString()}</p>
            <Button variant="danger" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
            <Button variant="info" onClick={() => handleSelectEvent(event._id)}>View Participants</Button>
            <Button variant="success" onClick={() => handleDownloadCsv(event._id)}>Download Participants</Button>
          </div>
        ))}
      </div>
      {selectedEventId && (
        <div className="mt-4">
          <h3>Participants</h3>
          <p>Total Participants: {participants.length}</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Group ID</th>
                <th>Member Count</th>
                <th>Group Name</th>
                
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Year</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedParticipants).map(([groupId, { members, count }], index) => (
                <React.Fragment key={groupId}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{groupId}</td>
                    <td>{count}</td>
                    <td colSpan="5"></td>
                  </tr>
                  {members.map((participant, memberIndex) => (
                    <tr key={participant._id}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{participant.group}</td>
                      <td>{participant.name}</td>
                      <td>{participant.email}</td>
                      <td>{participant.phone}</td>
                      <td>{participant.year}</td>
                      <td>{participant.branch}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventFee">
              <Form.Label>Fee</Form.Label>
              <Form.Control type="text" name="fee" value={formData.fee} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventRule">
              <Form.Label>Rule</Form.Label>
              <Form.Control type="text" name="rule" value={formData.rule} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventGroupSize">
              <Form.Label>Group Size</Form.Label>
              <Form.Control as="select" name="groupSize" value={formData.groupSize} onChange={handleChange}>
                <option value={1}>Group 1</option>
                <option value={2}>Group 2</option>
                <option value={3}>Group 3</option>
                <option value={4}>Group 4</option>
                <option value={5}>Group 5</option>
                <option value={6}>Group 6</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleAddEvent}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admin;
