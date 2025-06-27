// script.js

// Giriş işlemi
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
  location.reload();
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
    li.style.cursor = "pointer";
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
  const oldName = prompt("Düzenlenecek işyeri adı:");
  const wp = workplaces.find(w => w.name === oldName);
  if (wp) {
    const newName = prompt("Yeni işyeri adı:", wp.name);
    if (newName) {
      wp.name = newName;
      saveData();
      loadWorkplaces();
    }
  } else {
    alert("İşyeri bulunamadı.");
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
  const docName = document.getElementById("docName").value;
  const docDiploma = document.getElementById("docDiploma").value;
  localStorage.setItem("doctorInfo", JSON.stringify({ docName, docDiploma }));
  alert("Doktor bilgisi kaydedildi.");
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

    // EK-2 butonu
    const ek2Cell = row.insertCell();
    const ek2Btn = document.createElement("button");
    ek2Btn.textContent = "EK-2 Ekle / Değiştir";
    ek2Btn.onclick = () => openEK2(idx);
    ek2Cell.appendChild(ek2Btn);

    // Dosya Yükle butonu
    const fileCell = row.insertCell();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.tif,.tiff";
    fileInput.onchange = (e) => alert("Dosya yüklendi: " + e.target.files[0].name);
    fileCell.appendChild(fileInput);

    const editCell = row.insertCell();
    const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.onclick = () => editEmployee(idx);
    editCell.appendChild(editBtn);

    const delCell = row.insertCell();
    const delBtn = document.createElement("button");
    delBtn.textContent = "Sil";
    delBtn.onclick = () => {
      if (confirm("Silinsin mi?")) {
        employees.splice(idx, 1);
        saveData();
        loadEmployees();
      }
    };
    delCell.appendChild(delBtn);

    row.ondblclick = () => viewEK2History(idx);
    row.style.cursor = "pointer";
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  if (name && tc) {
    workplaces[currentWorkplace].employees.push({
      name,
      tc,
      sonMuayene: "",
      sonrakiMuayene: "",
      ek2History: []
    });
    saveData();
    loadEmployees();
  }
}

function editEmployee(index) {
  const emp = workplaces[currentWorkplace].employees[index];
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
  const today = new Date();
  const todayStr = String(today.getDate()).padStart(2, '0') + '.' +
                   String(today.getMonth() + 1).padStart(2, '0') + '.' +
                   today.getFullYear();
  document.getElementById("muayeneTarihi").value = todayStr;
  document.getElementById("ek2Modal").style.display = "block";
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
  selectedEmployeeIndex = null;
}

function saveEK2() {
  const tarih = document.getElementById("muayeneTarihi").value;
  const valid = /^\d{2}\.\d{2}\.\d{4}$/.test(tarih);
  if (!valid) {
    alert("Tarih biçimi hatalı. gg.aa.yyyy olmalı.");
    return;
  }
  const emp = workplaces[currentWorkplace].employees[selectedEmployeeIndex];
  emp.sonMuayene = tarih;

  const parts = tarih.split(".");
  const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  date.setFullYear(date.getFullYear() + 5);
  const next = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

  emp.sonrakiMuayene = next;
  emp.ek2History = emp.ek2History || [];
  emp.ek2History.push(tarih);

  saveData();
  loadEmployees();
  closeEK2();
}

function viewEK2History(index) {
  const emp = workplaces[currentWorkplace].employees[index];
  if (emp.ek2History && emp.ek2History.length > 0) {
    alert("EK-2 Geçmişi:\n" + emp.ek2History.join("\n"));
  } else {
    alert("EK-2 kaydı yok.");
  }
}

document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5);
    e.target.value = v;
  }
});
