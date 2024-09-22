import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  Toast,
} from "react-bootstrap";
import "../CSS/Events.css";
import { FaBook } from "react-icons/fa";
import toast from "react-hot-toast";

const Events = () => {
  const [event, setEvent] = useState(null);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [participantData, setParticipantData] = useState([
    {
      name: "",
      email: "",
      phone: "",
      year: "",
      branch: "",
    },
  ]);
  const [groupSize, setGroupSize] = useState(1);
  const { id } = useParams();

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`https://iic-backend-lcp6.onrender.com/events/${id}`);
      setEvent(response.data);
      setGroupSize(response.data.groupSize);
      setParticipantData(
        Array(response.data.groupSize).fill({
          name: "",
          email: "",
          phone: "",
          year: "",
          branch: "",
          group: ""
        })
      );
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedParticipants = [...participantData];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [name]: value,
      group: groupName
    };
    setParticipantData(updatedParticipants);
  };

  const handleGroupNameChange = (e) => {
    const { value } = e.target;
    setGroupName(value);
    // Update all participants with the new group name
    const updatedParticipants = participantData.map((p) => ({
      ...p,
      group: value,
    }));
    setParticipantData(updatedParticipants);
  };

  const handleRegisterParticipants = async () => {
    try {
      // Ensure all participant details are filled out
      const allFilled = participantData.every(
        (p) => p.name && p.email && p.phone
      );
  
      if (!allFilled) {
        alert("Please fill out all participant details.");
        return;
      }
  
      // Send a single request with the array of participants
      const response = await axios.post(
        `https://iic-backend-lcp6.onrender.com/events/${id}/participants`,
        { participants: participantData }
      );
  
      if (response.status === 200) {
        handleClose(); // Close the modal on success
        toast.success("Participants registered successfully");
        // console.log(participantData)
      } else {
        toast.error("Failed to register participants");
      }
    } catch (error) {
      // console.error("Error registering participants", error);
      alert("Error occurred while registering participants.");
    }
  };
  
  if (!event) return <p>Loading...</p>;

  return (
    <Container className="mt-1 event-container">
      <Row className="justify-content-center">
        <Col md={8} className="event-info mb-4">
          <Image
            src={
              event.image 
            }
            alt={event.name}
            fluid
            className="event-image"
          />
          <Card className="p-3 shadow event-details">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{event.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <h4>Fee: {event.fee}</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <p>{event.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={4} className="d-flex flex-column align-items-center">
          <Card className="p-3 text-center shadow action-card">
            <Button
              variant="primary"
              onClick={handleShow}
              className="mb-3 register-btn"
            >
              Register Participants
            </Button>
              {!showModal && event &&
              <a href={`https://drive.google.com/file/d/${event.rule}`} style={{width:"100%"}}>
                <Button variant="secondary" className="rulebook-btn w-100">  
                  <FaBook className="me-2" />
                  Rule Book
                </Button>
                </a>
              }
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} style={{height:""}} centered size="lg">
      <div style={{height:"50rem",border:"2px solid red"}}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body style={{height:"83%"}}>
          <iframe
            title="Google Drive PDF"
            src={`https://drive.google.com/file/d/119hiywrd_vKWtiPH-_WHtdFt7-qKsT8w/preview`}
            style={{width:"100%",height:"100%"}}
            allowFullScreen
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
    </div>
      </Modal>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="mb-3">
            <Form.Group controlId="formGroupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={groupName}
                onChange={handleGroupNameChange}
                placeholder="Enter group name"
              />
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
                />
              </Form.Group>
              <Form.Group controlId={`formParticipantEmail${index}`}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={participant.email}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter participant's email"
                />
              </Form.Group>
              <Form.Group controlId={`formParticipantPhone${index}`}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={participant.phone}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter participant's phone number"
                />
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
                </div>
              </Form.Group>
              <Form.Group controlId={`formParticipantBranch${index}`}>
                <Form.Label>Branch</Form.Label>
                <Form.Control
                  as="select"
                  name="branch"
                  value={participant.branch}
                  onChange={(e) => handleChange(e, index)}
                >
                  <option>Computer Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Electrical Engineering</option>
                  <option>Information Technology</option>
                  <option>Mechanical Engineering</option>
                </Form.Control>
              </Form.Group>
            </Form>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRegisterParticipants}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Events;