// --- Giriş ---
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

// --- Veriler ---
let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = null;
let selectedEmployeeIndex = null;

// --- İş Yeri Fonksiyonları ---
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
  const names = workplaces.map(wp => wp.name).join("\n");
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

// --- Doktor Bilgisi ---
function saveDoctorInfo() {
  const docName = document.getElementById("docName").value;
  const docDiploma = document.getElementById("docDiploma").value;
  localStorage.setItem("doctorInfo", JSON.stringify({ docName, docDiploma }));
  alert("Doktor bilgisi kaydedildi.");
}

// --- Çalışanlar ---
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

    const ek2Cell = row.insertCell();
    const ek2Btn = document.createElement("button");
    ek2Btn.textContent = "EK-2 Ekle / Değiştir";
    ek2Btn.onclick = () => openEK2(idx);
    ek2Cell.appendChild(ek2Btn);

    const fileCell = row.insertCell();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.tif,.tiff";
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

    row.ondblclick = () => {
      if (emp.ek2Tarih) {
        alert("EK-2 Geçmiş:\n" + emp.ek2Tarih);
      } else {
        alert("Bu kişiye ait EK-2 kaydı bulunamadı.");
      }
    };

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
      ek2Tarih: ""
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

// --- EK2 ---
function openEK2(index) {
  selectedEmployeeIndex = index;
  const emp = workplaces[currentWorkplace].employees[index];
  document.getElementById("muayeneTarihi").value = emp.ek2Tarih || "";
  document.getElementById("ek2Modal").style.display = "flex";
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
}

function saveEK2() {
  const input = document.getElementById("muayeneTarihi").value;
  const valid = /^\d{2}\.\d{2}\.\d{4}$/.test(input);
  if (!valid) {
    alert("Tarih biçimi hatalı. gg.aa.yyyy olmalı.");
    return;
  }

  const emp = workplaces[currentWorkplace].employees[selectedEmployeeIndex];
  emp.ek2Tarih = input;
  emp.sonMuayene = input;

  const parts = input.split(".");
  const nextDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  nextDate.setFullYear(nextDate.getFullYear() + 5);

  const formattedNext = String(nextDate.getDate()).padStart(2, "0") + "." +
                        String(nextDate.getMonth() + 1).padStart(2, "0") + "." +
                        nextDate.getFullYear();

  emp.sonrakiMuayene = formattedNext;

  saveData();
  loadEmployees();
  closeEK2();
}

// --- Tarih Noktalama ---
document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5);
    e.target.value = v;
  }
});

// --- LocalStorage ---
function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}
