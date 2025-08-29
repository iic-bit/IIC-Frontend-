import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const IdeaPage = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await axios.get('https://iic-backend-5opn.onrender.com/idea');
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas', error);
    }
  };

  return (
    <div className='container'>
      <h1>Submitted Ideas</h1>
      <Table className='text-break' striped bordered hover>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Idea Name</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Branch</th>
            <th>Year</th>
            <th>Idea Description</th>
            <th>Prototype Link</th>
            <th>PPT Uploaded</th>
            <th>Submitted On</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea, index) => (
            <tr key={idea._id}>
              <td>{index + 1}</td>
              <td>{idea.ideaname}</td>
              <td>{idea.name}</td>
              <td>{idea.email}</td>
              <td>{idea.phone}</td>
              <td>{idea.branch}</td>
              <td>{idea.year}</td>
              <td>{idea.idea}</td>
              <td>{idea.proto}</td>
              <td>{idea.pptUpload ? <a href={`https://iic-backend-5opn.onrender.com/file/${idea.pptUpload}`} download>Download PPT</a> : 'No PPT'}</td>
              <td>{new Date(idea.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default IdeaPage;
