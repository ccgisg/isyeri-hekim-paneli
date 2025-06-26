
const passwordInput = document.getElementById("password");
const panel = document.getElementById("panel");
const employeeTable = document.querySelector("#employeeTable tbody");
const workplaceList = document.getElementById("workplaceList");

function login() {
  if (passwordInput.value === "hekim2025") {
    panel.style.display = "block";
  } else {
    alert("Şifre yanlış");
  }
}

function addWorkplace() {
  const name = prompt("İşyeri adı:");
  if (name) {
    const li = document.createElement("li");
    li.textContent = name;
    li.style.cursor = "pointer";
    li.onclick = () => loadEmployees(name);
    workplaceList.appendChild(li);
  }
}

let currentWorkplace = "";

function loadEmployees(name) {
  currentWorkplace = name;
  localStorage.setItem("currentWorkplace", name);
  renderEmployees();
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const today = new Date().toISOString().split("T")[0];
  const next = new Date();
  next.setFullYear(next.getFullYear() + 5);
  const nextDate = next.toISOString().split("T")[0];

  const employees = getEmployees();
  employees.push({ name, tc, last: today, next: nextDate });
  saveEmployees(employees);
  renderEmployees();
}

function renderEmployees() {
  employeeTable.innerHTML = "";
  const employees = getEmployees();
  employees.forEach((e, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.name}</td>
      <td>${e.tc}</td>
      <td>${e.last}</td>
      <td>${e.next}</td>
      <td><button onclick="editEmployee(${i})">Düzenle</button></td>
      <td><button onclick="deleteEmployee(${i})">Sil</button></td>
    `;
    employeeTable.appendChild(row);
  });
}

function editEmployee(i) {
  const employees = getEmployees();
  const e = employees[i];
  e.name = prompt("Ad Soyad:", e.name);
  e.tc = prompt("TC:", e.tc);
  e.last = prompt("Son Muayene:", e.last);
  const next = new Date(e.last);
  next.setFullYear(next.getFullYear() + 5);
  e.next = next.toISOString().split("T")[0];
  saveEmployees(employees);
  renderEmployees();
}

function deleteEmployee(i) {
  const employees = getEmployees();
  employees.splice(i, 1);
  saveEmployees(employees);
  renderEmployees();
}

function getEmployees() {
  const key = `employees_${currentWorkplace}`;
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveEmployees(data) {
  const key = `employees_${currentWorkplace}`;
  localStorage.setItem(key, JSON.stringify(data));
}

function saveDoctorInfo() {
  localStorage.setItem("docName", document.getElementById("docName").value);
  localStorage.setItem("docDiploma", document.getElementById("docDiploma").value);
}

window.onload = () => {
  currentWorkplace = localStorage.getItem("currentWorkplace") || "";
  if (currentWorkplace) renderEmployees();
  document.getElementById("docName").value = localStorage.getItem("docName") || "";
  document.getElementById("docDiploma").value = localStorage.getItem("docDiploma") || "";
};
