// class for new employee 
class Employee {
    constructor(name, position) {
        this.name = name;
        this.position = position;
    }
}
//class for new department
class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.employees = [];
    }
    //add new employee to the department class
    addEmployee(employee) {
        this.employees.push(employee);
    }
    //!delete employee from the department class
    deleteEmployee(employee) {
        let index = this.employees.indexOf(employee);
        this.employees.splice(index, 1);
    }
}

//where departments will be stored
let departments = [];
let departmentId = 0;

//function to add departments to the department array
onClick('new-department', () => {
    departments.push(new Department(departmentId++, getValue('new-department-name')));
    drawDOM();
    document.getElementById('new-department-name').value='';
});

function onClick(id, action) {
    let element = document.getElementById(id);
    element.addEventListener('click', () => {
      // get the department name input value
      let departmentName = getValue('new-department-name');
  
      // check if the department name is empty
      if (!departmentName) {
        alert('Please enter a department name');
        return;
      }
  
      // call the action function if the department name is not empty
      action();
    });
  
    return element;
  }
  

function getValue(id) {
    return document.getElementById(id).value;
}
// function to manipulate the DOM to create the employee table and put employee information into table
function drawDOM() {
    let departmentDiv = document.getElementById('departments');
    clearElement(departmentDiv);
    for (department of departments) {
        let table = createDepartmentTable(department);
        let title = document.createElement('h2');
        title.innerHTML = department.name;
        title.appendChild(createDeleteDepartmentButton(department));
        departmentDiv.appendChild(title);
        departmentDiv.appendChild(table);
        for (employee of department.employees) {
            createEmployeeRow(department, table, employee);
        }
    }

}
// function to save departments to localStorage
function saveDepartments() {
    localStorage.setItem('departments', JSON.stringify(departments));
  }
  // function to load departments from localStorage
  function loadDepartments() {
    let savedDepartments = JSON.parse(localStorage.getItem('departments'));
    if (savedDepartments) {
      departments = savedDepartments.map(departmentData => {
        let department = new Department(departmentData.id, departmentData.name);
        departmentData.employees.forEach(employeeData => {
          let employee = new Employee(employeeData.name, employeeData.position);
          department.addEmployee(employee);
        });
        return department;
      });
      drawDOM();
    }
  }
  // load saved departments when the page is loaded
  window.onload = loadDepartments;
  // save departments when the page is unloaded
  window.onunload = saveDepartments;
//creates the employee table when information is added
function createEmployeeRow(department, table, employee) {
    let row = table.insertRow(2);
    row.insertCell(0).innerHTML = employee.name;
    row.insertCell(1).innerHTML = employee.position;
    let actions = row.insertCell(2); 
    actions.appendChild(createDeleteRowButton(department, employee));
    actions.appendChild(createEditRowButton(department, employee));
}
//edit button always you to edit the department and employee
function createEditRowButton(department, employee) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-success';
    btn.innerHTML = 'Edit';
    btn.onclick = () => {
        let name = prompt('Enter the new name:', employee.name);
        let position = prompt('Enter the new position:', employee.position);
        if (name !== null && position !== null) {
            employee.name = name;
            employee.position = position;
            drawDOM();
        }
    };
    return btn;
}
//!delete button for employees
function createDeleteRowButton(department, employee) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.innerHTML = 'Delete';
    btn.onclick= () => {
        let index = department.employees.indexOf(employee);
        department.employees.splice(index, 1);
        drawDOM();
    }
    return btn;
}
//! delete button for department
function createDeleteDepartmentButton(department) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.innerHTML = 'Delete Department';
    btn.onclick = () => {
        let index = departments.indexOf(department);
        departments.splice(index, 1);
        drawDOM();
    }
    return btn;
}
//Adds new employee
function createNewEmployeeButton(department) {
    let btn = document.createElement('button')
    btn.className = 'btn btn-primary';
    btn.innerHTML = 'Create';
    //!When button is clicked if fields are not filled in then it will read alert with message 
    btn.onclick = () => {
        let nameInput = getValue(`name-input-${department.id}`);
        let positionInput = getValue(`position-input-${department.id}`);
        if (nameInput !== '' && positionInput !== '') {
            department.employees.push(new Employee(nameInput, positionInput));
            drawDOM();
        } else {
            alert('Please fill out both Name and Position fields before creating a new employee.');
        }
    }
    return btn;
}

function createDepartmentTable(department) {
let table = document.createElement('table');
table.setAttribute('class', 'table table-hover table-primary table-striped');
let row = table.insertRow(0);
let nameColumn = document.createElement('th');
let positionColumn = document.createElement('th');
nameColumn.innerHTML = 'Name';
positionColumn.innerHTML = 'Position';
row.appendChild(nameColumn);
row.appendChild(positionColumn);
let formRow = table.insertRow(1);
//creating name coloumn for the table
let nameTh = document.createElement('th');
let positionTh= document.createElement('th'); 
let createTh = document.createElement('th');
let nameInput = document.createElement('input'); 
nameInput.setAttribute('id', `name-input-${department.id}`);
nameInput.setAttribute('type', 'text');
nameInput.setAttribute('class', 'form-control');
nameInput.setAttribute('placeholder', 'Name');
//creating position coloumn for the table
let positionInput = document.createElement('input'); 
positionInput.setAttribute('id', `position-input-${department.id}`);
positionInput.setAttribute('type', 'text');
positionInput.setAttribute('class', 'form-control');
positionInput.setAttribute('placeholder', 'Position');
let newEmployeeButton = createNewEmployeeButton(department);
nameTh.appendChild(nameInput);
positionTh.appendChild(positionInput);
createTh.appendChild(newEmployeeButton);
formRow.appendChild(nameTh);
formRow.appendChild(positionTh);
formRow.appendChild(createTh);
return table;

}
//clears form
function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
    
}
