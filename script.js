const apiUrl = "http://localhost:3000/employees";

document.addEventListener("DOMContentLoaded", () => {
  fetchEmployees();

  document.getElementById("employeeForm").addEventListener("submit", handleFormSubmit);
  document.getElementById("searchInput").addEventListener("input", handleSearch);

  // ✅ Event delegation for edit and delete buttons
  document.getElementById("employeeTableBody").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.getAttribute("data-id");
      editEmployee(id);
    } else if (e.target.classList.contains("delete-btn")) {
      const id = e.target.getAttribute("data-id");
      deleteEmployee(id);
    }
  });
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("employeeId").value;
  const employee = getFormData();

  if (!employee) {
    alert("Please fill all fields.");
    return;
  }

  const options = {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  };

  const url = id ? `${apiUrl}/${id}` : apiUrl;

  await fetch(url, options);
  resetForm();
  fetchEmployees();
}

function getFormData() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const salary = document.getElementById("salary").value;
  const department = document.getElementById("department").value.trim();
  const gender = document.querySelector("input[name='gender']:checked")?.value;
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !salary || !department || !gender || !address) return null;

  return { name, email, salary, department, gender, address };
}

async function fetchEmployees() {
  const res = await fetch(apiUrl);
  const employees = await res.json();
  renderTable(employees);
}

function renderTable(employees) {
  const tableBody = document.getElementById("employeeTableBody");
  tableBody.innerHTML = "";

  employees.forEach(emp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.email}</td>
      <td>${emp.salary}</td>
      <td>${emp.department}</td>
      <td>${emp.gender}</td>
      <td>${emp.address}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${emp.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${emp.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function editEmployee(id) {
  const res = await fetch(`${apiUrl}/${id}`);
  const emp = await res.json();

  document.getElementById("employeeId").value = emp.id;
  document.getElementById("name").value = emp.name;
  document.getElementById("email").value = emp.email;
  document.getElementById("salary").value = emp.salary;
  document.getElementById("department").value = emp.department;

  const genderInput = document.querySelector(`input[name="gender"][value="${emp.gender}"]`);
  if (genderInput) genderInput.checked = true;

  document.getElementById("address").value = emp.address;
  document.getElementById("submitBtn").textContent = "Update Employee";
}

async function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchEmployees();
  }
}

function resetForm() {
  document.getElementById("employeeForm").reset();
  document.getElementById("employeeId").value = "";
  document.getElementById("submitBtn").textContent = "Add Employee";
}

async function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const res = await fetch(apiUrl);
  const employees = await res.json();
  const filtered = employees.filter(emp => emp.name.toLowerCase().includes(query));
  renderTable(filtered);
}
