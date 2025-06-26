
let password = "hekim2025";
let workplaces = [];
let selectedWorkplace = null;
let employees = {};

function login() {
  const input = document.getElementById("password").value;
  if (input === password) {
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Şifre yanlış!");
  }
}

function addWorkplace() {
  const name = prompt("İşyeri adı:");
  if (name) {
    workplaces.push(name);
    employees[name] = [];
    renderWorkplaces();
  }
}

function renderWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach((wp) => {
    const li = document.createElement("li");
    li.textContent = wp;
    li.style.cursor = "pointer";
    li.ondblclick = () => selectWorkplace(wp);
    list.appendChild(li);
  });
}

function selectWorkplace(name) {
  selectedWorkplace = name;
  document.getElementById("employeeSection").style.display = "block";
  renderEmployees();
}

function addEmployee() {
  const fullName = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const today = new Date().toISOString().split("T")[0];
  const nextDate = new Date();
  nextDate.setFullYear(nextDate.getFullYear() + 5);
  const nextCheck = nextDate.toISOString().split("T")[0];

  if (fullName && tc) {
    employees[selectedWorkplace].push({
      fullName,
      tc,
      lastCheck: today,
      nextCheck,
    });
    renderEmployees();
  }
}

function renderEmployees() {
  const tbody = document.getElementById("employeeTable").querySelector("tbody");
  tbody.innerHTML = "";
  const list = employees[selectedWorkplace] || [];
  list.forEach((emp, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.fullName}</td>
      <td>${emp.tc}</td>
      <td>${emp.lastCheck}</td>
      <td>${emp.nextCheck}</td>
      <td><button onclick="editEmployee(${i})">Düzenle</button></td>
      <td><button onclick="deleteEmployee(${i})">Sil</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function editEmployee(index) {
  const emp = employees[selectedWorkplace][index];
  const newDate = prompt("Yeni Son Muayene Tarihi (YYYY-AA-GG):", emp.lastCheck);
  if (newDate) {
    emp.lastCheck = newDate;
    const next = new Date(newDate);
    next.setFullYear(next.getFullYear() + 5);
    emp.nextCheck = next.toISOString().split("T")[0];
    renderEmployees();
  }
}

function deleteEmployee(index) {
  employees[selectedWorkplace].splice(index, 1);
  renderEmployees();
}

function saveDoctorInfo() {
  const name = document.getElementById("docName").value;
  const diploma = document.getElementById("docDiploma").value;
  alert("Kaydedildi: " + name + " - " + diploma);
}
