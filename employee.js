// Employee class to represent each employee
class Employee {
  constructor(name, address, empId, designation) {
    this.name = name;
    this.address = address;
    this.empId = empId;
    this.designation = designation;
  }
}

// Array to store employee details
const employeeList = [];

// Function to display a message
function showMessage(message, type) {
  const messageContainer = document.getElementById("messageContainer");
  messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 800);
}

// Function to display the form for adding employee details
function showAddForm() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `
      <div id="messageContainer"></div>
      <div id="mainPage">
          <h2>Add New Employee</h2>
          <form onsubmit="addEmployee(); return false;" id="addForm">
              <label for="name">Name:</label>
              <input type="text" id="name" pattern="[A-Za-z ]+" title="Name should contain only letters and spaces" required><br>
  
              <label for="address">Address:</label>
              <input type="text" id="address" required><br>
  
              <label for="empId">Employee ID:</label>
              <input type="text" id="empId" required><br>
  
              <label for="designation">Designation:</label>
              <input type="text" id="designation" required><br>
  
              <button type="submit">Add Employee</button>
          </form>
      </div>
    `;
}

// Function to add employee details to the array
function addEmployee() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const empId = document.getElementById("empId").value;
  const designation = document.getElementById("designation").value;

  // Validate name to contain only letters and spaces
  if (!/^[A-Za-z ]+$/.test(name)) {
    showMessage("Name should only contain letters and spaces.", "error");
    return;
  }

  // Check if there is an existing employee with the same name and ID
  const isEmployeeExist = employeeList.some(
    (employee) =>
      employee.name.toLowerCase() === name.toLowerCase() &&
      employee.empId === empId
  );

  if (isEmployeeExist) {
    // Display error message if both name and ID match an existing employee
    showMessage(
      "Employee already exists. Please enter different details.",
      "error"
    );
    return;
  }

  // Check if the employee ID already exists
  const isIdUnique = employeeList.every((employee) => employee.empId !== empId);

  if (!isIdUnique) {
    // Display error message if ID is not unique
    showMessage(
      "Employee ID must be unique. Please enter a different ID.",
      "error"
    );
    return;
  }

  const newEmployee = new Employee(name, address, empId, designation);
  employeeList.push(newEmployee);

  // Clear the form
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("empId").value = "";
  document.getElementById("designation").value = "";

  // Display success message
  showMessage("Employee added successfully!", "success");
}

// Function to display the table of employee details
function showEmployeeList() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `
      <div id="messageContainer"></div>
      <h2>Employee List</h2>
      <table>
          <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Employee ID</th>
              <th>Designation</th>
              <th>Action</th>
          </tr>
          ${employeeList
            .map(
              (employee, index) => `
                  <tr>
                      <td>${employee.name}</td>
                      <td>${employee.address}</td>
                      <td>${employee.empId}</td>
                      <td>${employee.designation}</td>
                      <td>
                          <button class="edit" onclick="editEmployee(${index})">Edit</button>
                          <button class="delete" onclick="deleteEmployee(${index})">Delete</button>
                      </td>
                  </tr>
              `
            )
            .join("")}
      </table>
    `;
}

// Function to display the form for editing employee details
function editEmployee(index) {
  const selectedEmployee = employeeList[index];
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `
      <div id="messageContainer"></div>
      <h2>Edit Employee Detail</h2>
      <form onsubmit="updateEmployee(${index}); return false;" id="editForm">
          <label for="name">Name:</label>
          <input type="text" id="name" value="${selectedEmployee.name}" required><br>
  
          <label for="address">Address:</label>
          <input type="text" id="address" value="${selectedEmployee.address}" required><br>
  
          <label for="empId">Employee ID:</label>
          <input type="text" id="empId" value="${selectedEmployee.empId}" required><br>
  
          <label for="designation">Designation:</label>
          <input type="text" id="designation" value="${selectedEmployee.designation}" required><br>
  
          <button type="submit" class="edit">Update Employee</button>
          <button type="button" class="cancel" onclick="showEmployeeList()">Cancel</button>
      </form>
    `;
}

// Function to update employee details in the array
function updateEmployee(index) {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const empId = document.getElementById("empId").value;
  const designation = document.getElementById("designation").value;

  const updatedEmployee = new Employee(name, address, empId, designation);

  // Check if the updated ID is unique, excluding the current employee
  const isIdUnique = employeeList.every(
    (employee, i) => i === index || employee.empId !== empId
  );

  if (!isIdUnique) {
    // Display error message if updated ID is not unique
    showMessage(
      "Employee ID must be unique. Please enter a different ID.",
      "error"
    );
    return;
  }

  employeeList[index] = updatedEmployee;

  // Display the updated employee list
  showEmployeeList();

  // Display success message
  showMessage("Employee updated successfully!", "success");
}

// Function to delete an employee from the array
function deleteEmployee(index) {
  employeeList.splice(index, 1);

  // Display the updated employee list
  showEmployeeList();

  // Display success message
  showMessage("Employee deleted successfully!", "success");
}

// Function to display the form for searching employee details
function showSearchForm() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `
      <div id="messageContainer"></div>
      <h2>Search Employee</h2>
      <form onsubmit="searchEmployee(); return false;" id="searchForm">
          <label for="searchName">Search by Name or ID:</label>
          <input type="text" id="searchName" required><br>
  
          <button type="submit">Search</button>
      </form>
      <div id="searchResult" class="search-result" style="display: none;"></div>
    `;
}

// Function to search for employee by name or ID
function searchEmployee() {
  const searchNameOrId = document.getElementById("searchName").value.trim(); // Trim spaces from the input
  const resultDiv = document.getElementById("searchResult");

  // Find employees with matching name or ID (ignoring spaces)
  const foundEmployees = employeeList.filter(
    (employee) =>
      employee.name.toLowerCase().replace(/\s/g, "") ===
        searchNameOrId.toLowerCase().replace(/\s/g, "") ||
      employee.empId.replace(/\s/g, "") === searchNameOrId.replace(/\s/g, "")
  );

  if (foundEmployees.length === 0) {
    // No employee found with the given name or ID
    resultDiv.innerHTML =
      "<h3>No employee found with the given name or ID.</h3>";
  } else if (foundEmployees.length === 1) {
    // Only one employee found, display details
    const foundEmployee = foundEmployees[0];
    resultDiv.innerHTML = `
          <h3>Employee Details</h3>
          <p>Name: ${foundEmployee.name}</p>
          <p>Address: ${foundEmployee.address}</p>
          <p>Employee ID: ${foundEmployee.empId}</p>
          <p>Designation: ${foundEmployee.designation}</p>
      `;
  } else {
    // Multiple employees found with the same name, create a form to ask for ID
    const formHTML = `
          <form onsubmit="submitEmployeeId(); return false;">
              <label for="employeeIdInput">Enter Employee ID:</label>
              <input type="text" id="employeeIdInput" required>
              <button type="submit">Submit</button>
          </form>
      `;
    resultDiv.innerHTML = formHTML;
  }

  // Show the search result box
  resultDiv.style.display = "block";
}

// Function to submit the Employee ID from the form
function submitEmployeeId() {
  const employeeIdInput = document.getElementById("employeeIdInput").value;

  // Find the employee with the entered ID
  const foundEmployee = employeeList.find(
    (employee) => employee.empId === employeeIdInput
  );

  const resultDiv = document.getElementById("searchResult");

  if (foundEmployee) {
    resultDiv.innerHTML = `
          <h3>Employee Details</h3>
          <p>Name: ${foundEmployee.name}</p>
          <p>Address: ${foundEmployee.address}</p>
          <p>Employee ID: ${foundEmployee.empId}</p>
          <p>Designation: ${foundEmployee.designation}</p>
      `;
  } else {
    resultDiv.innerHTML = "<h3>No employee found with the given ID.</h3>";
  }
}
