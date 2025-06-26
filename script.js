
function login() {
  const password = document.getElementById("password").value;
  if (password === "hekim2025") {
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

let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = "";

function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach(wp => {
    const li = document.createElement("li");
    li.textContent = wp.name;
    li.ondblclick = () => openWorkplace(wp.name);
    list.appendChild(li);
  });
}

function addWorkplace() {
  const name = prompt("Yeni işyeri adı:");
  if (name) {
    workplaces.push({ name, employees: [] });
    saveData();
    loadWorkplaces();
  }
}

function editWorkplace() {
  const name = prompt("Düzenlenecek işyeri adı:");
  const newName = prompt("Yeni işyeri adı:");
  const wp = workplaces.find(w => w.name === name);
  if (wp && newName) {
    wp.name = newName;
    saveData();
    loadWorkplaces();
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

function saveDoctorInfo() {
  alert("Doktor bilgileri kaydedildi.");
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC:");
  const muayeneTarihi = prompt("Muayene Tarihi (gg.aa.yyyy):");
  if (name && tc && muayeneTarihi) {
    const [gun, ay, yil] = muayeneTarihi.split('.');
    const sonraki = new Date(yil, ay - 1, gun);
    sonraki.setFullYear(sonraki.getFullYear() + 5);
    const sonrakiStr = `${("0"+sonraki.getDate()).slice(-2)}.${("0"+(sonraki.getMonth()+1)).slice(-2)}.${sonraki.getFullYear()}`;

    const wp = workplaces.find(w => w.name === currentWorkplace);
    wp.employees.push({ name, tc, son: muayeneTarihi, sonraki: sonrakiStr });
    saveData();
    loadEmployees();
  }
}

function loadEmployees() {
  const tbody = document.getElementById("employeeTable").querySelector("tbody");
  tbody.innerHTML = "";
  const wp = workplaces.find(w => w.name === currentWorkplace);
  wp.employees.forEach((emp, idx) => {
    const row = tbody.insertRow();
    row.insertCell(0).innerText = emp.name;
    row.insertCell(1).innerText = emp.tc;
    row.insertCell(2).innerText = emp.son;
    row.insertCell(3).innerText = emp.sonraki;
    row.insertCell(4).innerHTML = '<button onclick="editEmployee(' + idx + ')">Düzenle</button>';
    row.insertCell(5).innerHTML = '<button onclick="deleteEmployee(' + idx + ')">Sil</button>';
  });
}

function editEmployee(index) {
  const wp = workplaces.find(w => w.name === currentWorkplace);
  const emp = wp.employees[index];
  const newName = prompt("Ad Soyad:", emp.name);
  const newTc = prompt("TC:", emp.tc);
  const newSon = prompt("Muayene Tarihi (gg.aa.yyyy):", emp.son);

  const [gun, ay, yil] = newSon.split('.');
  const sonraki = new Date(yil, ay - 1, gun);
  sonraki.setFullYear(sonraki.getFullYear() + 5);
  const sonrakiStr = `${("0"+sonraki.getDate()).slice(-2)}.${("0"+(sonraki.getMonth()+1)).slice(-2)}.${sonraki.getFullYear()}`;

  wp.employees[index] = { name: newName, tc: newTc, son: newSon, sonraki: sonrakiStr };
  saveData();
  loadEmployees();
}

function deleteEmployee(index) {
  const wp = workplaces.find(w => w.name === currentWorkplace);
  wp.employees.splice(index, 1);
  saveData();
  loadEmployees();
}

function exportToExcel() {
  alert("⬇ Excel'e Aktarma özelliği eklenecek (demo uyarı)");
}

function importFromExcel(event) {
  alert("⬆ Excel'den Alma özelliği eklenecek (demo uyarı)");
}
