import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function EnrollNow() {
  const [event, setEvent] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [participantData, setParticipantData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [groupNameError, setGroupNameError] = useState(false); // New state for group name error
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://iic-backend-lcp6.onrender.com/events/${id}`);
        setEvent(response.data);
        setParticipantData(
          Array(response.data.groupSize).fill({
            name: "",
            email: "",
            phone: "",
            college:"",
            year: "",
            branch: "",
            group: "",
          })
        );
      } catch (error) {
        console.error("Error fetching event", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedParticipants = [...participantData];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [name]: value,
      group: groupName,
    };
    setParticipantData(updatedParticipants);
  };

  const handleGroupNameChange = (e) => {
    const { value } = e.target;
    setGroupName(value);
    setGroupNameError(!value.trim()); // Check if group name is empty

    const updatedParticipants = participantData.map((p) => ({ ...p, group: value }));
    setParticipantData(updatedParticipants);
  };

  const validateForm = () => {
    let newErrors = participantData.map((p) => ({
      name: !p.name,
      email: !p.email,
      phone: !p.phone,
      year: !p.year,
      branch: !p.branch,
    }));
    setErrors(newErrors);

    const isGroupNameValid = !!groupName.trim(); // Ensure group name is not empty
    setGroupNameError(!isGroupNameValid);

    return isGroupNameValid && newErrors.every((err) => Object.values(err).every((field) => !field));
  };

  const handleRegisterParticipants = async () => {
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `https://iic-backend-lcp6.onrender.com/events/${id}/participants`,
        { participants: participantData }
      );

      if (response.status === 200) {
        toast.success("Participants registered successfully");
        navigate("/");
      } else {
        toast.error("Failed to register participants");
      }
    } catch (error) {
      alert("Error occurred while registering participants.");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container">
      <Form className="mb-3">
        <Form.Group controlId="formGroupName">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            value={groupName}
            onChange={handleGroupNameChange}
            placeholder="Enter group name"
            required
            isInvalid={groupNameError} // Show error if empty
          />
          <Form.Control.Feedback type="invalid">Group name is required</Form.Control.Feedback>
        </Form.Group>
      </Form>

      {participantData.map((participant, index) => (
        <Form key={index} className="mb-3 participant-form">
          <h5>Participant {index + 1}</h5>

          <Form.Group controlId={`formParticipantName${index}`}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={participant.name}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter participant's name"
              required
              isInvalid={errors[index]?.name}
            />
            <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId={`formParticipantEmail${index}`}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={participant.email}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter participant's email"
              required
              isInvalid={errors[index]?.email}
            />
            <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId={`formParticipantPhone${index}`}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="phone"
              value={participant.phone}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter participant's phone number"
              required
              isInvalid={errors[index]?.phone}
            />
            <Form.Control.Feedback type="invalid">Phone number is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId={`formParticipantPhone${index}`}>
            <Form.Label>College Name</Form.Label>
            <Form.Control
              type="text"
              name="college"
              value={participant.college}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter College Name"
              required
              isInvalid={errors[index]?.college}
            />
            <Form.Control.Feedback type="invalid">Phone number is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId={`formParticipantYear${index}`}>
                <Form.Label>Year</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="First Year"
                    name="year"
                    value="first"
                    checked={participant.year === "first"}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <Form.Check
                    type="radio"
                    label="Second Year"
                    name="year"
                    value="second"
                    checked={participant.year === "second"}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <Form.Check
                    type="radio"
                    label="Third Year"
                    name="year"
                    value="third"
                    checked={participant.year === "third"}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <Form.Check
                    type="radio"
                    label="Fourth Year"
                    name="year"
                    value="fourth"
                    checked={participant.year === "fourth"}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              </Form.Group>

          <Form.Group controlId={`formParticipantBranch${index}`}>
            <Form.Label>Branch</Form.Label>
            <Form.Control
              as="select"
              name="branch"
              value={participant.branch}
              onChange={(e) => handleChange(e, index)}
              required
              isInvalid={errors[index]?.branch}
            >
              <option value="">Select Option</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="other">other</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">Branch selection is required</Form.Control.Feedback>
          </Form.Group>
          { participant.branch=="other" && <Form.Group controlId={`formParticipantPhone${index}`}>
            <Form.Label>Enter Your Branch</Form.Label>
            <Form.Control
              type="text"
              name="branch"
              value={participant.branch}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter Your Branch"
              required
              isInvalid={errors[index]?.branch}
            />
            <Form.Control.Feedback type="invalid">Branch is Required !</Form.Control.Feedback>
          </Form.Group>}
        </Form>
      ))}

      <Button variant="primary" onClick={handleRegisterParticipants}>
        Register
      </Button>
    </div>
  );
}
