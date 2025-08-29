import React from "react";
import { useForm } from "react-hook-form";
import "../CSS/IdeaHub.css"; // Custom CSS for responsiveness
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const IdeaHub = () => {

  const Navigate=useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('ideaname', data.teamProjectName);
    formData.append('name', data.leaderName);
    formData.append('email', data.leaderEmail);
    formData.append('phone', data.leaderPhone);
    formData.append('branch', data.branch);
    formData.append('year', data.year);
    formData.append('no', data.groupMembers);
    formData.append('idea', data.ideaDescription);
    formData.append('proto', data.prototypeReady);
    formData.append('pptUpload', data.pptUpload[0]); // Access the first file

    try {
      const response = await fetch('https://iic-backend-5opn.onrender.com/idea', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Idea submitted successfully');
        Navigate("/")
      } else {
        const errorData = await response.json();
        alert(`Failed to submit idea: ${errorData.message || response.status}`);
      }
      
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  return (
    <div className="form-container my-3">
      <h4>Submit your Idea here...</h4>
      <hr/>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Team Name/Project Name */}
        <div className="form-group">
          <label htmlFor="teamProjectName">Team Name/Project Name</label>
          <input
            type="text"
            id="teamProjectName"
            placeholder="Enter team or project name (e.g., TN_Name or PN_Name)"
            {...register("teamProjectName", { required: true })}
          />
          {errors.teamProjectName && (
            <p className="error">This field is required</p>
          )}
        </div>

        {/* Innovator/Team Leader Details */}
        <h4>Innovator/Team Leader Details</h4>
        <div className="form-group">
          <label htmlFor="leaderName">Name</label>
          <input
            type="text"
            id="leaderName"
            placeholder="Enter leader name"
            {...register("leaderName", { required: true })}
          />
          {errors.leaderName && <p className="error">This field is required</p>}
        </div>
        <div className="form-group">
          <label htmlFor="leaderEmail">Email ID</label>
          <input
            type="email"
            id="leaderEmail"
            placeholder="Enter email ID"
            {...register("leaderEmail", { required: true })}
          />
          {errors.leaderEmail && (
            <p className="error">This field is required</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="leaderPhone">Phone Number</label>
          <input
            type="number"
            id="leaderPhone"
            placeholder="Enter phone number"
            {...register("leaderPhone", { required: true })}
          />
          {errors.leaderPhone && (
            <p className="error">This field is required</p>
          )}
        </div>
        <div className="form-group d-flex justify-content-between">
  <div>
    <label htmlFor="year">Year</label>
    <select
      id="year"
      placeholder="Select year"
      {...register("year", { required: true })}
    >
      <option value="">Select Year</option>
      <option value="first">First Year</option>
      <option value="second">Second Year</option>
      <option value="third">Third Year</option>
    </select>
    {errors.year && <p className="error">This field is required</p>}
  </div>
  <div>
    <label htmlFor="branch">Branch</label>
    <select
      id="branch"
      placeholder="Select branch"
      {...register("branch", { required: true })}
    >
      <option value="">Select Branch</option>
      <option value="Computer Engineering">Computer Engineering</option>
      <option value="Civil Engineering">Civil Engineering</option>
      <option value="Electrical Engineering">Electrical Engineering</option>
      <option value="Information Technology">Information Technology</option>
      <option value="Mechanical Engineering">Mechanical Engineering</option>
    </select>
    {errors.branch && <p className="error">This field is required</p>}
  </div>

 
        </div>

        {/* No. of Group Members */}
        <div className="form-group">
          <label htmlFor="groupMembers">
            No. of Group Members (Including Team Leader)
          </label>
          <input
            type="number"
            id="groupMembers"
            placeholder="Enter number of group members"
            {...register("groupMembers", { required: true })}
          />
          {errors.groupMembers && (
            <p className="error">This field is required</p>
          )}
        </div>

        {/* Idea Description */}
        <div className="form-group">
          <label htmlFor="ideaDescription">Idea Description (200 words)</label>
          <textarea
            id="ideaDescription"
            placeholder="Describe your idea"
            {...register("ideaDescription", { required: true })}
          ></textarea>
          {errors.ideaDescription && (
            <p className="error">This field is required</p>
          )}
        </div>

        {/* PPT Upload */}
        <div className="form-group">
          <label htmlFor="pptUpload">Upload PPT (With Specific Format)</label>
          <input
            type="file"
            id="pptUpload"
            accept=".ppt,.pptx"
            {...register("pptUpload", { required: true })}
          />
          {errors.pptUpload && <p className="error">This field is required</p>}
        </div>

        {/* Prototype Ready */}
        <div className="form-group">
          <label>Do you have a prototype ready?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="Yes"
                {...register("prototypeReady", { required: true })}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="No"
                {...register("prototypeReady", { required: true })}
              />
              No
            </label>
          </div>
          {errors.prototypeReady && (
            <p className="error">This field is required</p>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default IdeaHub;
