const express = require('express');
const { getAllEmployee,addNewEmployee,updateEmployee,deleteEmployee,searchEmployee,filterEmployees,calculateAvgSalaryCompany,calculateAvgSalaryByDepartment } = require("../controller/empController");
const router = express.Router();

router.route('/getAllEmployee').get(getAllEmployee);
router.route('/addEmployee').post(addNewEmployee);
router.route('/updateEmployee').post(updateEmployee);
router.route('/deleteEmployee/:id').delete(deleteEmployee);
router.route('/searchEmployee').get(searchEmployee);
router.route('/filterEmployee').get(filterEmployees);
router.route('/getAvgSalaryCompany').get(calculateAvgSalaryCompany);
router.route('/avgsalbydep').get(calculateAvgSalaryByDepartment);

module.exports = router;