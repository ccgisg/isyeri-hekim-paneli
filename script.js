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

let employeeData = {};
let currentWorkplace = "";

function login() {
  const password = document.getElementById("password").value;
  if (password === "hekim2025") {
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
  } else {
    alert("Şifre yanlış!");
  }
}

function addWorkplace() {
  const name = prompt("İşyeri adı:");
  if (name) {
    const li = document.createElement("li");
    li.textContent = name;
    li.ondblclick = () => openWorkplace(name);
    document.getElementById("workplaceList").appendChild(li);
    employeeData[name] = [];
  }
}

function editWorkplace() {
  const list = document.getElementById("workplaceList").children;
  const names = Array.from(list).map((li, i) => `${i + 1}. ${li.textContent}`).join("\n");
  const choice = prompt(`Düzenlenecek işyerinin numarası:\n${names}`);
  const index = parseInt(choice) - 1;
  if (!isNaN(index) && index >= 0 && index < list.length) {
    const oldName = list[index].textContent;
    const newName = prompt("Yeni işyeri adı:", oldName);
    if (newName) {
      list[index].textContent = newName;
      list[index].ondblclick = () => openWorkplace(newName);
      employeeData[newName] = employeeData[oldName];
      delete employeeData[oldName];
    }
  }
}

function openWorkplace(name) {
  currentWorkplace = name;
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = name;
  renderEmployees();
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
}

function saveDoctorInfo() {
  alert("Doktor bilgileri kaydedildi.");
}

function renderEmployees() {
  const tbody = document.getElementById("employeeTable").querySelector("tbody");
  tbody.innerHTML = "";
  const list = employeeData[currentWorkplace] || [];
  list.forEach((emp, index) => {
    const row = tbody.insertRow();
    row.insertCell(0).innerText = emp.name;
    row.insertCell(1).innerText = emp.tc;
    row.insertCell(2).innerText = emp.lastDate;
    row.insertCell(3).innerText = emp.nextDate;
    const editCell = row.insertCell(4);
    const delCell = row.insertCell(5);
    editCell.innerHTML = "<button onclick='editEmployee(" + index + ")'>Düzenle</button>";
    delCell.innerHTML = "<button onclick='deleteEmployee(" + index + ")'>Sil</button>";
    row.ondblclick = () => openEK2Form(emp);
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC:");
  const date = prompt("Muayene Tarihi (YYYY-AA-GG):");
  if (!name || !tc || !date) return;
  const muayeneTarihi = new Date(date);
  const sonraki = new Date(muayeneTarihi);
  sonraki.setFullYear(sonraki.getFullYear() + 5);
  employeeData[currentWorkplace].push({
    name,
    tc,
    lastDate: date,
    nextDate: sonraki.toISOString().split('T')[0]
  });
  renderEmployees();
}

function editEmployee(index) {
  const emp = employeeData[currentWorkplace][index];
  const name = prompt("Ad Soyad:", emp.name);
  const tc = prompt("TC:", emp.tc);
  if (!name || !tc) return;
  emp.name = name;
  emp.tc = tc;
  renderEmployees();
}

function deleteEmployee(index) {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    employeeData[currentWorkplace].splice(index, 1);
    renderEmployees();
  }
}

function openEK2Form(emp) {
  alert(`EK-2 Formu Açıldı:\nAd Soyad: ${emp.name}\nTC: ${emp.tc}\nMuayene: ${emp.lastDate}`);
}
