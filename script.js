
function login() {
  const pass = document.getElementById("password").value;
  if (pass === "1234") {
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Şifre yanlış!");
  }
}

let selectedWorkplace = null;
const workplaces = [];
const employees = [];

function addWorkplace() {
  const name = prompt("İş yeri adı:");
  if (name) {
    workplaces.push(name);
    renderWorkplaces();
  }
}

function renderWorkplaces() {
  const ul = document.getElementById("workplaces");
  ul.innerHTML = "";
  workplaces.forEach((wp, i) => {
    const li = document.createElement("li");
    li.innerText = wp;
    li.style.cursor = "pointer";
    li.onclick = () => {
      selectedWorkplace = wp;
      renderEmployees();
    };
    ul.appendChild(li);
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const today = new Date().toISOString().split("T")[0];
  const next = new Date();
  next.setFullYear(next.getFullYear() + 5);
  const nextDate = next.toISOString().split("T")[0];

  if (name && tc) {
    employees.push({ name, tc, lastCheck: today, nextCheck: nextDate });
    renderEmployees();
  }
}

function renderEmployees() {
  const table = document.getElementById("employeeTable");
  table.innerHTML = "<tr><th>Ad Soyad</th><th>TC</th><th>Son Muayene</th><th>Sonraki Muayene</th><th>Düzenle</th><th>Sil</th></tr>";
  employees.forEach((emp, i) => {
    const row = table.insertRow();
    row.insertCell(0).innerText = emp.name;
    row.insertCell(1).innerText = emp.tc;
    row.insertCell(2).innerText = emp.lastCheck;
    row.insertCell(3).innerText = emp.nextCheck;
    row.insertCell(4).innerHTML = `<button onclick="editEmployee(${i})">Düzenle</button>`;
    row.insertCell(5).innerHTML = `<button onclick="deleteEmployee(${i})">Sil</button>`;
  });
}

function editEmployee(i) {
  const emp = employees[i];
  emp.name = prompt("Ad Soyad:", emp.name) || emp.name;
  emp.tc = prompt("TC Kimlik No:", emp.tc) || emp.tc;
  emp.lastCheck = prompt("Son Muayene Tarihi (yyyy-aa-gg):", emp.lastCheck) || emp.lastCheck;

  const next = new Date(emp.lastCheck);
  next.setFullYear(next.getFullYear() + 5);
  emp.nextCheck = next.toISOString().split("T")[0];

  renderEmployees();
}

function deleteEmployee(i) {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    employees.splice(i, 1);
    renderEmployees();
  }
}

function saveSettings() {
  const doctor = document.getElementById("doctorName").value;
  const diploma = document.getElementById("diplomaNo").value;
  alert(`Kaydedildi:\nDoktor: ${doctor}\nDiploma No: ${diploma}`);
}
