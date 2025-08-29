import { useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import axios from "axios";
import '../CSS/Event.css'; // Custom CSS for additional styling
import toast from "react-hot-toast";

function TextExample() {
    const [event, setEvent] = useState([]);

    useEffect(() => {
        axios.get('https://iic-backend-5opn.onrender.com/events')
            .then((response) => {
                setEvent(response.data);
            });
    }, []);

    // console.log(event)

    return (
        <Container className="text-example-container">
            <h1 className='text-center'>Events</h1>
            <Row className="justify-content-center">
                {event.length !== 0?<>
                {event.map((event) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={event._id} className="mb-4 d-flex align-items-stretch" style={{cursor:"pointer"}}>
                        <Card className="event-card" onClick={() => window.location.href = `/event/${event._id}`}>
                            <Card.Img variant="top" src={event.image} alt="Event Image" className="event-image" />
                            <Card.Body>
                                <Card.Title className="event-title">{event.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted event-subtitle"><b>{event.description.split("-")[0]}</b></Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                </>:<p>There are no upcoming events !!</p>}
            </Row>
        </Container>
    );
}

export default TextExample;
