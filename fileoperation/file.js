const fs= require('fs');

const ReadFile = ()=>{
    try {
       let employees = JSON.parse(fs.readFileSync('./employees.json', 'utf8')) ;
       
       return employees;
    } catch (error) {
        console.log("some erro while reading the file");
    }
}

const saveInFile = (employees)=>{
    try {
        fs.writeFileSync('./employees.json', JSON.stringify(employees, null, 2), 'utf8')
    } catch (error) {
       console.log("some error occurs while saving in the file"); 
    }
}

module.exports = {
    ReadFile,
    saveInFile
}
