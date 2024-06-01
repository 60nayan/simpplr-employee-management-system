import React, { useState } from 'react';
import '../styles/card.css'
import axios from 'axios';
const Card = ({employee,setAllEmployees}) => {
 
  const [showModal,setShowModal]=useState(false);
  const [newEmp, setNewEmp] =useState(
    {"fullName": "","age": null, "dob":"","salary": null,"department": ""}
  );
 
  const formInput = (e)=>{
    const { name, value } = e.target;
    setNewEmp(prevState => ({
      ...prevState,
      [name]: value
    })
    );
  }
  const updateEmployee = async (e) => {
    e.preventDefault();
    try {
      console.log(newEmp);
      const { data } = await axios.post(`/api/v1/updateEmployee`, { id: employee.id, newEmp });
      //console.log('Updated details:', data);
      if (data.error) {
        alert(data.error);
        return;
      }
      setShowModal(false);
      setAllEmployees(data);
      setNewEmp({"fullName": "","age": null,"salary": null,"department": ""});
      
      alert(" employee updated successfully ");
    }
    catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };
  const deleteEmployee = async(ele)=>{
      try {
        
        const res = await axios.delete(`/api/v1/deleteEmployee/${ele}`);
        //console.log(res.data);
        setAllEmployees(res.data.data);
        alert(res.data.msg);
        
      } catch (error) {
        console.log(error);
        alert("error while deleting the employee");
      }
  }
  return (
    <>
      <div className="card-container">
        <h3>{employee?.fullName}</h3> 
          <p>Age: {employee?.age}</p>
          <p>Date of Birth: {employee.dob}</p>
         <p>Salary: {employee?.salary}</p>
         <p>Department: {employee?.department}</p>
         {/* <h3>Name:Govind</h3>
         <p>Age:22</p>
         <p>Name:Govind</p>
         <p>Salary:450000</p>
         <p>Department:IT</p> */}
         <div className="card-button">
            <button className='update-button' onClick={()=>setShowModal(true)}>update</button>
            <button className='delete-button' onClick={()=>deleteEmployee(employee.id)}>Delete</button>
         </div>
        {
          showModal && <div className="modal-card">
           <h3>Update Employee Form</h3>
            <form className="add-form-card" onSubmit={updateEmployee} >
              <input  type="text" name="fullName" value={newEmp?.fullName} onChange={formInput}  placeholder="Enter employee update name" className="add-input-card"/>
              <input  type="number" name="age" value={newEmp?.age} onChange={formInput}  placeholder="Enter employee update age" className="add-input-card"/>
              <input  type="number" name="salary" value={newEmp?.salary} onChange={formInput}  placeholder="Enter employee update salary" className="add-input-card"/>
              <input  type="text" name="department" value={newEmp?.department} onChange={formInput}  placeholder="Enter employee update dapartment" className="add-input-card"/>
              <button type="submit" className="form-button">Update Employee</button>
            </form>
            <button className="hide-form-button" onClick={()=>setShowModal(false)}>Hide Form</button>
          </div>
        }

      </div>
    </>
  );
}

export default Card;
