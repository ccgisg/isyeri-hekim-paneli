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
  document.getElementById("mainView").style.display = "none";
  document.getElementById("loginArea").style.display = "block";
}

let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = null;
let selectedEmployeeIndex = null;

function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach((wp, index) => {
    const li = document.createElement("li");
    li.textContent = wp.name;
    li.ondblclick = () => openWorkplace(index);
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
  const names = workplaces.map(w => w.name).join("\n");
  const oldName = prompt("Düzenlenecek işyeri adı:\n" + names);
  if (!oldName) return;
  const wp = workplaces.find(w => w.name === oldName);
  if (wp) {
    const newName = prompt("Yeni adı:", wp.name);
    if (newName) {
      wp.name = newName;
      saveData();
      loadWorkplaces();
    }
  }
}

function openWorkplace(index) {
  currentWorkplace = index;
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = workplaces[index].name;
  loadEmployees();
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
}

function saveDoctorInfo() {
  const name = document.getElementById("docName").value;
  const diploma = document.getElementById("docDiploma").value;
  localStorage.setItem("doctorInfo", JSON.stringify({ name, diploma }));
  alert("Doktor bilgileri kaydedildi.");
}

function loadEmployees() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  const employees = workplaces[currentWorkplace].employees;

  employees.forEach((emp, idx) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = emp.name;
    row.insertCell().innerText = emp.tc;
    row.insertCell().innerText = emp.sonMuayene || "";
    row.insertCell().innerText = emp.sonrakiMuayene || "";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.onclick = () => editEmployee(idx);
    row.insertCell().appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Sil";
    delBtn.onclick = () => {
      if (confirm("Silmek istiyor musunuz?")) {
        employees.splice(idx, 1);
        saveData();
        loadEmployees();
      }
    };
    row.insertCell().appendChild(delBtn);

    row.ondblclick = () => openEK2(idx);
    row.style.cursor = "pointer";
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  if (name && tc) {
    workplaces[currentWorkplace].employees.push({
      name, tc,
      sonMuayene: "",
      sonrakiMuayene: ""
    });
    saveData();
    loadEmployees();
  }
}

function editEmployee(idx) {
  const emp = workplaces[currentWorkplace].employees[idx];
  const name = prompt("Ad Soyad:", emp.name);
  const tc = prompt("TC Kimlik No:", emp.tc);
  if (name && tc) {
    emp.name = name;
    emp.tc = tc;
    saveData();
    loadEmployees();
  }
}

function openEK2(index) {
  selectedEmployeeIndex = index;
  document.getElementById("muayeneTarihi").value = "";
  document.getElementById("ek2Modal").style.display = "flex";
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
}

function saveEK2() {
  const dateStr = document.getElementById("muayeneTarihi").value;
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    alert("Tarih formatı yanlış. gg.aa.yyyy olmalı.");
    return;
  }

  const emp = workplaces[currentWorkplace].employees[selectedEmployeeIndex];
  emp.sonMuayene = dateStr;

  const [gg, aa, yyyy] = dateStr.split(".");
  const next = new Date(`${yyyy}-${aa}-${gg}`);
  next.setFullYear(next.getFullYear() + 5);
  const formatted =
    String(next.getDate()).padStart(2, "0") + "." +
    String(next.getMonth() + 1).padStart(2, "0") + "." +
    next.getFullYear();
  emp.sonrakiMuayene = formatted;

  saveData();
  loadEmployees();
  closeEK2();
}

// Otomatik tarih nokta ekleme
document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5);
    e.target.value = v;
  }
});

// Placeholder: Excel işlemleri
function exportToExcel() {
  alert("Excel'e Aktar özelliği geliştiriliyor.");
}
function importFromExcel(event) {
  alert("Excel'den Al özelliği geliştiriliyor.");
}
