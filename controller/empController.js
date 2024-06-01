const fs = require("fs");

// THIS SECTION OF CODE FOR READING THE FILE AND SAVE THE FILE
let employees;
try {
  employees = JSON.parse(fs.readFileSync("./employees.json", "utf8"));
  //console.log(employees);
} catch (error) {
  console.log("error while reading the file", error);
}

const saveInFile = () => {
  try {
    fs.writeFileSync(
      "./employees.json",
      JSON.stringify(employees, null, 2),
      "utf8"
    );
  } catch (error) {
    console.log("error saving the file ", error);
  }
};

// HERE START THE BUSSINESS LOGIC

const getAllEmployee = (req, res) => {
  try {
    //console.log(employees);
    res.status(200).json(employees);
  } catch (error) {
    console.log("some error while fetching the employee data", error);
  }
};

const addNewEmployee = (req, res) => {
  try {
    const data = req.body.newEmp;
    console.log(data);
    for (let key in data) {
      if (data[key] === null || data[key] === undefined || data[key] === "") {
        return res.json({ error: "All fields are required fill correctly" });
      }
    }

    employees.sort((a, b) => {
      return a.id - b.id;
    });
    let len = employees.length;
    let empId = employees[len - 1].id + 1;
    employees.push({ ...data, id: empId });
    saveInFile();

    return res.status(200).json({
      msg: "Data added successFully",
      data: employees
    });
  } catch (error) {
    console.log("some error occur while add new Data", error);
  }
};

const updateEmployee = (req, res) => {
  try {
    //console.log(req.params.id);
    // let empIdparam= req.params.id;
    let empId = parseInt(req.body.id);
    const data = req.body.newEmp;
    console.log(empId);
    console.log(data);
    for (let key in data) {
      if (data[key] === null || data[key] === undefined || data[key] === "") {
        return res
          .status(200)
          .json({ error: "All fields are required fill correctly" });
      }
    }

    let empIndex = employees.findIndex((employee) => employee.id === empId);

    if (empIndex !== -1) {
      employees[empIndex] = { ...data, id: empId };
      saveInFile();
      res.status(200).json(employees);
    } else {
      res.status(200).json({ msg: "data is not present in file" });
    }
  } catch (error) {
    console.log("error while updating the Employee", error);
    res.status(500).json({error:"some server error"});
  }
};

const deleteEmployee = (req, res) => {
  try {
    //console.log("hello");
    const empId = parseInt(req.params.id);
    let indexToDelete = -1;
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].id === empId) {
        indexToDelete = i;
        break;
      }
    }
    if (indexToDelete !== -1) {
      employees.splice(indexToDelete, 1);
    } else {
      return res
        .status(401)
        .json({ msg: "something went wrong, employee not found !! " });
    }

    saveInFile();
    res.status(200).json({
      msg: "employee Deted successfully",
      data: employees,
    });
  } catch (error) {
    console.log("some error while deleting the employee", error);
  }
};

const searchEmployee = (req, res) => {
  //console.log(item);
  try {
    //const type = Object.keys(req.query)[0];
    const { item, type } = req.query;
    // console.log(item);
    // console.log(type);
    if (type === "name") {
      const name = req.query.item.toLowerCase();
      const result = employees.filter((employee) =>
        employee.fullName.toLowerCase().includes(name)
      );
      return res.status(200).json(result);
    }
    if (type === "department") {
      const department = req.query.item.toLowerCase();
      console.log(department);
      const result = employees.filter((employee) =>
        employee.department.toLowerCase().includes(department)
      );
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log("error while searching the employye", error);
  }
};

const filterEmployees = (req, res) => {
  try {
    const option = req.query.option;
    //console.log(option);
    if(option == ""){
        return res.status(200).json({msg:"option is empty please choose any option"})
    }
    // any one will run based on condition
    if (option == "nameAsc") {
      // console.log("nameAsc");
      employees.sort((a, b) => {
        const nameA = a.fullName.toUpperCase();
        const nameB = b.fullName.toUpperCase();

        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });
      return res.status(200).json(employees);
    } 
     if (option == "nameDesc") {
      employees.sort((a, b) => {
        const nameA = a.fullName.toUpperCase();
        const nameB = b.fullName.toUpperCase();

        if (nameA < nameB) {
          return 1;
        } else if (nameA > nameB) {
          return -1;
        } else {
          return 0;
        }
      });
      return res.status(200).json(employees);
    } 
    if (option == "salaryLow") {
      employees.sort((a, b) => {
        return a.salary - b.salary;
      });
      return res.status(200).json(employees);
    } 
    if(option == "salaryHigh") {
      employees.sort((a, b) => {
        return b.salary - a.salary;
      });
      return res.status(200).json(employees);
    }
  } catch (error) {
    console.log("error while sorting employees", error);
    res.status(500).json({
      error: "Some Internal Server Error",
    });
  }
};

const calculateAvgSalaryCompany = (req,res)=>{
    try {
        if(employees.length===0){
            return res.status(200).json({msg:"Employee not present"});
        }

        let sumSal=0;
        for(let emp of employees ){
            sumSal+=parseInt(emp.salary);
        }
        let avg = sumSal / employees.length;
        avgSalary = avg.toFixed(2);
        res.status(200).json({avgSal:avgSalary});
    } catch (error) {
        res.status(500).json({error:"Something went wrong"});
       console.log("error whilecalculating AVG Salary of Company",error); 
    }
}

const calculateAvgSalaryByDepartment = (req, res) => {
  try {
   // console.log("hello");
    console.log(req.query);
      const department = (req.query.department).toLowerCase();
      const employeesInDepartment = employees.filter((employee) => 
        employee.department.toLowerCase() === department
        );
       
      // console.log(employeesInDepartment)
      if (employeesInDepartment.length === 0) {
          return res.status(200).json({ error: "Department not found or has no employees" });
      }

      const totalSalary = employeesInDepartment.reduce((sum, employee) => sum + parseFloat(employee.salary), 0);
      const avg = totalSalary / employeesInDepartment.length;
      const avgSalary = avg.toFixed(2);

      return res.status(200).json({avgSalary});
  } catch (error) {
      console.error("Error calculating average salary by department:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getAllEmployee,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee,
  filterEmployees,
  calculateAvgSalaryCompany,
  calculateAvgSalaryByDepartment
};
