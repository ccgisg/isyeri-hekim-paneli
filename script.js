
let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = "";

function login() {
  const pw = document.getElementById("password").value;
  if (pw === "hekim2025") {
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    loadWorkplaces();
  } else {
    alert("Şifre yanlış!");
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => openWorkplace(name);
    list.appendChild(li);
  });
}

function addWorkplace() {
  const name = prompt("Yeni işyeri adı:");
  if (name && !workplaces.includes(name)) {
    workplaces.push(name);
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    localStorage.setItem(name + "_employees", "[]");
    loadWorkplaces();
  } else if (workplaces.includes(name)) {
    alert("Bu isimde bir işyeri zaten var.");
  }
}

function openWorkplace(name) {
  currentWorkplace = name;
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = name;
  loadEmployees();
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
}

function editWorkplace() {
  const oldName = prompt("Düzenlemek istediğiniz işyeri adı:");
  if (!oldName || !workplaces.includes(oldName)) return alert("İşyeri bulunamadı.");
  const newName = prompt("Yeni işyeri adı:");
  if (!newName) return;
  const index = workplaces.indexOf(oldName);
  workplaces[index] = newName;

  const employeeData = localStorage.getItem(oldName + "_employees");
  localStorage.setItem(newName + "_employees", employeeData);
  localStorage.removeItem(oldName + "_employees");

  localStorage.setItem("workplaces", JSON.stringify(workplaces));
  loadWorkplaces();
}

function addEmployee() {
  if (!currentWorkplace) return;
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const employees = JSON.parse(localStorage.getItem(currentWorkplace + "_employees") || "[]");
  employees.push({ name, tc, lastCheck: "", nextCheck: "" });
  localStorage.setItem(currentWorkplace + "_employees", JSON.stringify(employees));
  loadEmployees();
}

function loadEmployees() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  const employees = JSON.parse(localStorage.getItem(currentWorkplace + "_employees") || "[]");
  employees.forEach(emp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.tc}</td>
      <td>${emp.lastCheck || "-"}</td>
      <td>${emp.nextCheck || "-"}</td>
      <td><button onclick="editEmployee('${emp.tc}')">Düzenle</button></td>
      <td><button onclick="deleteEmployee('${emp.tc}')">Sil</button></td>
    `;
    tbody.appendChild(row);
  });
}

function editEmployee(tc) {
  const employees = JSON.parse(localStorage.getItem(currentWorkplace + "_employees") || "[]");
  const emp = employees.find(e => e.tc === tc);
  if (!emp) return;
  emp.name = prompt("Yeni ad soyad:", emp.name) || emp.name;
  emp.tc = prompt("Yeni TC:", emp.tc) || emp.tc;
  localStorage.setItem(currentWorkplace + "_employees", JSON.stringify(employees));
  loadEmployees();
}

function deleteEmployee(tc) {
  let employees = JSON.parse(localStorage.getItem(currentWorkplace + "_employees") || "[]");
  employees = employees.filter(e => e.tc !== tc);
  localStorage.setItem(currentWorkplace + "_employees", JSON.stringify(employees));
  loadEmployees();
}
