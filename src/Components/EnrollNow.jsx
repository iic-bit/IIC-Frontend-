import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Tesseract from "tesseract.js";
import qr from "../Images/Hk.jpg"
import "../CSS/EnrollNow.css"

export default function EnrollNow() {
  const [event, setEvent] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [participantData, setParticipantData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [groupNameError, setGroupNameError] = useState(false); // New state for group name error
  const [transactionIdError, setTransactionIdError] = useState(false); // New state for group name error
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState("");
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [conditionCheck,setConditionCheck]=useState(false);
  const performOCR = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setIsOcrProcessing(true);
    const reader = new FileReader();
    reader.onload = function () {
      // console.log("Starting OCR processing...");
      
      Tesseract.recognize(reader.result, "eng", { logger: (m) => null })
        .then(({ data: { text } }) => {
          // console.log("Extracted Text:", text); // Debugging
          setOcrText(text);
          
          const extractedId = extractTransactionId(text);
          if (extractedId) {
            setTransactionId(extractedId);
            // console.log("Extracted UPI transaction ID:", extractedId);
            toast.success("Transaction ID detected and auto-filled.");
          } else {
            console.log("Failed to match transaction ID pattern.");
            toast.error("Failed to extract UPI transaction ID.");
          }
        })
        .catch((error) => {
          console.error("OCR Error:", error);
          toast.error("Failed to extract text from image.");
        })
        .finally(() => setIsOcrProcessing(false));
    };
    reader.readAsDataURL(file);
    // var reader = new FileReader(); //this for convert to Base64
    guardarArchivo(event);
  };
  
  

  const extractTransactionId = (text) => {
    // console.log("Analyzing extracted text for Transaction ID...");
    if (text) {
      // console.log("OCR Text:", text); // Debug the OCR output
  
      // Try numeric match
      const numericPattern = /\b[0-9]{12,}\b/g;
      const numericMatch = text.match(numericPattern);
      if (numericMatch) {
        // console.log("Numeric Match Found:", numericMatch);
        setTransactionId(numericMatch[0]); // Use the first numeric match
        return numericMatch[0];
      }
  
      // Try alphanumeric match
      const alphanumericPattern = /\b[A-Z0-9]{12,}\b/g;
      const alphanumericMatch = text.match(alphanumericPattern);
      if (alphanumericMatch) {
        // console.log("Alphanumeric Match Found:", alphanumericMatch);
        setTransactionId(alphanumericMatch[0]); // Use the first alphanumeric match
        return alphanumericMatch[0];
      }
  
      console.warn("No Match Found");
      return null;
    }
  };
  
  const guardarArchivo = (event) => {
    const file = event.target.files[0]; //the file
    // performOCR(file);
    var reader = new FileReader(); //this for convert to Base64
    reader.readAsDataURL(file); //start conversion...
    reader.onload = function (e) {
      //.. once finished..
      var rawLog = reader.result.split(",")[1]; //extract only thee file data part
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      }; //preapre info to send to API
      fetch(
        "https://script.google.com/macros/s/AKfycbzUoBCscUecSuiH3rp_0rBhbB5hUO6jWynhbqF-FtyAWjyE3SA4T38D33bSNiAnKt1z/exec", //your AppsScript URL
        { method: "POST", body: JSON.stringify(dataSend) }
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          setDriveLink(a.url); //save the link to state
        })
        .catch((e) => console.log(e)); // Or Error in console
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting", participantData, transactionId);
    toast.success("Form submitted successfully!");
  };
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
            course:"",
            year: "",
            branch: "",
            group: "",
            transactionId: "",
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
      transactionId: transactionId,
    };
    setParticipantData(updatedParticipants);
  };

  const handleGroupNameChange = (e) => {
    const { value } = e.target;
    setGroupName(value);
    setGroupNameError(!value.trim()); // Check if group name is empty

    const updatedParticipants = participantData.map((p) => ({ ...p, group: value,transactionId: transactionId }));
    setParticipantData(updatedParticipants);
  };
  useEffect(() => {
    setParticipantData(prevData =>
      prevData.map(p => ({ ...p, transactionId }))
    );
  }, [transactionId]);
// kj  
  const validateForm = () => {
    let newErrors = participantData.map((p,index) => ({
      name: !p.name,
      email: !p.email,
      phone: !p.phone,
      college: !p.college,
      course: !p.course,
      year: !p.year,
      branch: !p.branch,
      transactionId: !p.transactionId
    }));
    setErrors(newErrors);

    const isGroupNameValid = !!groupName.trim(); // Ensure group name is not empty
    const istransactionIdValid = !!transactionId.trim(); // Ensure transactionId is not empty
    setGroupNameError(!isGroupNameValid);
    setTransactionIdError(!istransactionIdValid)

    return isGroupNameValid && newErrors.every((err) => Object.values(err).every((field) => !field));
  };

  

  if (!event) return <p>Loading...</p>;

  return (
    <div>{false?
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
              <Form.Control.Feedback type="invalid">College Name is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId={`formParticipantPhone${index}`}>
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                name="course"
                value={participant.course}
                onChange={(e) => handleChange(e, index)}
                placeholder="Enter Course Name"
                required
                isInvalid={errors[index]?.course}
              />
              <Form.Control.Feedback type="invalid">Course Name is required</Form.Control.Feedback>
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

            {/* <Form.Group controlId={`formParticipantBranch${index}`}>
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
            </Form.Group> 
            } */}

            <Form.Group controlId={`formParticipantPhone${index}`}>
              <Form.Label>Branch Name</Form.Label>
              <Form.Control
                type="text"
                name="branch"
                value={participant.branch}
                onChange={(e) => handleChange(e, index)}
                placeholder="Enter branch Name"
                required
                isInvalid={errors[index]?.branch}
              />
              <Form.Control.Feedback type="invalid">Branch Name is required</Form.Control.Feedback>
            </Form.Group>
            
          </Form>
        ))}
        
        <Form.Group>
          <Form.Label>Transaction ID</Form.Label>
          <Form.Control type="text" name='transectionId' value={transactionId} readOnly required isInvalid={transactionIdError} style={{ backgroundColor: "#e9f5e9" }} />
          <Form.Text className="text-muted">This field is auto-detected and cannot be edited.</Form.Text>
          <Form.Control.Feedback type="invalid">Please Upload Proof for the payment</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label> Upload Payment Proof</Form.Label>
          <Form.Control type="file" onChange={performOCR} />
        </Form.Group>

        {/* <div className='container d-flex justify-content-center mt-5 qr-code-section image'>
          <img src={qr} alt="payment image"/>
        </div> */}
        {/* <div className="d-flex mt-3 justify-content-end mt-5">
          <label className="">
            I aggree all the <a target='_blank' href='https://drive.google.com/file/d/1RC5sfVFEeMf6fTRVWOFC_XlupwrdBqcS/view?usp=sharing'>Terms & Conditions</a> 
          </label>
          <input className="form-check-input ms-2" type="checkbox" value={conditionCheck} onChange={(e)=>setConditionCheck(!conditionCheck)} style={{cursor:"pointer"}}/>
        </div> */}
        <div className='d-flex justify-content-end'>
          <Button onClick={handleRegisterParticipants} disabled={!conditionCheck}>Register</Button>
        </div>
      </div>:
      <h1 className='d-flex justify-content-center align-items-center' style={{fontWeight:"bolder",fontFamily:"monospace",color:"red"}}>
        Registrations Are Closed !!
      </h1>
    }
    </div>
  );
}
