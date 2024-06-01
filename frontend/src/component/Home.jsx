import React, { useState, useEffect } from "react";
import "../styles/home.css";
import Card from "./Card";
import axios from "axios";
const Home = () => {
  const [AllEmployees, setAllEmployees] = useState([]);
  const [typeSearch, setTypeSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [newEmp, setnewEmp] = useState({
    fullName: "",
    age: null,
    dob:"",
    salary: null,
    department: "",

  });
  const [show, setShow] = useState(false);
  const [showAvg, setShowAvg] = useState(false);
  const [companyAvgSal, setCompanyAvgSal] = useState(0);
  const [department, setDepartment] = useState("");
  const [AvgByDep, setAvgByDep] = useState(0);
  const [showAvginput, setShowAvginput] = useState(false);
  const [showDepSalry, setShowDepSalary] = useState(false);
  // const [filterOption,setFilterOption] =useState("");

  const formInput = (e) => {
    const { name, value } = e.target;
    setnewEmp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(newEmp);
  };

  const addEmpoyee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/addEmployee", {
        newEmp,
      });
      console.log(res.data);
      if (res.data.error) {
        alert(res.data.error);
        return;
      }
      
      setnewEmp({ fullName: "", age: 0, dob: "", salary: 0, department: "" });
      setAllEmployees(res.data.data);
      alert("Data added Successfully");
    } catch (error) {
      console.log("error while adding employee", error);
      alert("error while adding new employee");
    }
  };

  const getCompanyAvgSalary = async () => {
    try {
      const res = await axios.get(
        "/api/v1/getAvgSalaryCompany"
      );
      // console.log(res.data.avgSal);
      setCompanyAvgSal(res.data.avgSal);
      setShowAvg(true);
    } catch (error) {
      alert();
    }
  };

  const getAllEmployee = async () => {
    try {
      const res = await axios.get(
        "/api/v1/getAllEmployee"
      );
      //console.log(res.data);
      setAllEmployees(res.data);
    } catch (error) {
      alert("Something went wrong while fetching employee");
    }
  };

  const searchItem = (e) => {
    setSearchInput(e.target.value);
    if (searchInput.length === 1) getAllEmployee();
    //console.log(e.target.value);
  };

  const departmentChange = (e) => {
    setDepartment(e.target.value);
    //console.log(department);
  };

  const AvgSalaryByDepartment = async () => {
    try {
      const res = await axios.get("/api/v1/avgsalbydep", {
        params: {
          department: department,
        },
      });
      if (res.data.error) {
        alert(res.data.error);
        return;
      }
      console.log(res.data);
      setAvgByDep(res.data.avgSalary);
      setShowAvginput(false);
      setShowDepSalary(true);
    } catch (error) {
      alert(error);
    }
  };
  const searchEmployee = async () => {
    try {
      console.log(searchInput);
      console.log(typeSearch);

      const res = await axios.get(
        "/api/v1/searchEmployee",
        {
          params: {
            item: searchInput,
            type: typeSearch,
          },
        }
      );
      //9console.log(res.data);
      setAllEmployees(res.data);
    } catch (error) {
      console.log(error);
      alert("something went wrong ");
    }
  };

  const getFilterEmployee = async (ele) => {
    try {
      if (ele == "") {
        alert("Please select any option");
        return;
      }
      const { data } = await axios.get(
        "/api/v1/filterEmployee",
        {
          params: {
            option: ele,
          },
        }
      );

      if (data.error) {
        alert(data.error);
        return;
      }
  
      setAllEmployees(data);
    } catch (error) {
      alert("Some error while filtering Employees");
    }
  };
  useEffect(() => {
    getAllEmployee();
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <h2 style={{ color: "white" }}>Employee-Management</h2>
        </div>
        <div className="searchBox">
          <label
            htmlFor="selectedOption"
            className="select-label"
            style={{ color: "white" }}
          >
            Search By:{" "}
          </label>
          <select
            id="selectedOption"
            className="options"
            onChange={(e) => setTypeSearch(e.target.value)}
          >
            <option value="">Select</option>
            <option value="name">Name</option>
            <option value="department">department</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchInput}
            onChange={searchItem}
          />
          <button className="search-button" onClick={searchEmployee}>
            Search
          </button>
        </div>
        <div className="right-nav">
          <button className="addEmp-button" onClick={() => setShow(true)}>
            Add Employee
          </button>
        </div>
      </div>
      <div className="main">
        <div className="upper-header">
          {/* <div className="avgSalary"> */}
            <button className="avg-salary-button" onClick={getCompanyAvgSalary}>
              Show Average Salary
            </button>
            <button className="avg-salary-button" onClick={()=>setShowAvginput(true)}>AvgSal BY Department</button>
            {showAvginput && (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={department}
                  placeholder="Enter Department"
                  onChange={(e) => departmentChange(e)}
                  className="add-input"
                />
                <button className="dep-input" onClick={AvgSalaryByDepartment}>
                  submit
                </button>
                </>
              )}
              {
                showDepSalry && <p style={{ fontWeight: "bold", padding: "8px", color: "white" }}>
                Average Salary  Deparment: {AvgByDep}
              </p>
              }
              {showAvg && (
              <p style={{ fontWeight: "bold", padding: "8px", color: "white" }}>
                Average Salary of Company: {companyAvgSal}
              </p>
            )}
          {/* </div> */}
          {/* <div className="empText">
            <h3 style={{ color: "white" }}>Empoloyees List</h3>
          </div> */}
          <div className="filterEmp">
            <label
              htmlFor="selectedOption"
              className="select-label"
              style={{ color: "white" }}
            >
              Filter by:{" "}
            </label>
            <select
              id="selectedOption"
              className="options"
              onChange={(e) => getFilterEmployee(e.target.value)}
            >
              <option value="">Select</option>
              <option value="nameAsc">Name Asc</option>
              <option value="nameDesc">Name Desc</option>
              <option value="salaryLow">Salary Low</option>
              <option value="salaryHigh">Salary High</option>
            </select>
          </div>
        </div>
        <div className="showEmp">
          {show && (
            <div className="modal">
              <h3>Add Employee Form</h3>
              <form className="add-form" onSubmit={addEmpoyee}>
                <input
                  type="text"
                  name="fullName"
                  value={newEmp?.fullName}
                  onChange={formInput}
                  placeholder="Enter employee name"
                  className="add-input"
                />
                <input
                  type="number"
                  name="age"
                  value={newEmp?.age}
                  onChange={formInput}
                  placeholder="Enter employee age"
                  className="add-input"
                />
                <input
                  type="Date"
                  name="dob"
                  value={newEmp?.dob}
                  onChange={formInput}
                  placeholder="Enter employee DOB"
                  className="add-input"
                />
                <input
                  type="number"
                  name="salary"
                  value={newEmp?.salary}
                  onChange={formInput}
                  placeholder="Enter employee salary"
                  className="add-input"
                />
                <input
                  type="text"
                  name="department"
                  value={newEmp?.department}
                  onChange={formInput}
                  placeholder="Enter employee dapartment"
                  className="add-input"
                />
                <button type="submit" className="form-button">
                  Add Employee
                </button>
              </form>
              <button
                className="hide-form-button"
                onClick={() => setShow(false)}
              >
                Hide Form
              </button>
            </div>
          )}
          {AllEmployees.length !== 0 ? (
            AllEmployees.map((employee) => (
              <Card
                key={employee.id}
                employee={employee}
                setAllEmployees={setAllEmployees}
              />
            ))
          ) : (
            <h3>No employee Present</h3>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; Created by Nayan Gupta. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
