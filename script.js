// Güncel script.js dosyası

let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = null;
let selectedEmployeeIndex = null;

// Giriş
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

// Logout
function logout() {
  location.reload();
}

// İş yerlerini yükle
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
  const name = prompt("Yeni İş Yeri Adı:");
  if (name) {
    workplaces.push({ name, employees: [] });
    saveData();
    loadWorkplaces();
  }
}

function editWorkplace() {
  const names = workplaces.map(wp => wp.name).join("\n");
  const oldName = prompt("Düzenlenecek iş yeri adı:\n" + names);
  if (!oldName) return;
  const wp = workplaces.find(w => w.name === oldName);
  if (wp) {
    const newName = prompt("Yeni Ad:", wp.name);
    if (newName) {
      wp.name = newName;
      saveData();
      loadWorkplaces();
    }
  } else {
    alert("İş yeri bulunamadı.");
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

// Çalışanlar
function loadEmployees() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  const employees = workplaces[currentWorkplace].employees;

  employees.forEach((emp, idx) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = emp.name;
    row.insertCell().innerText = emp.tc;

    const son = emp.ek2Tarihleri && emp.ek2Tarihleri.length > 0 ? emp.ek2Tarihleri[emp.ek2Tarihleri.length - 1] : "";
    const sonraki = emp.ek2Tarihleri && emp.ek2Tarihleri.length > 0 ? hesapla5YilSonra(son) : "";

    row.insertCell().innerText = son;
    row.insertCell().innerText = sonraki;

    const ek2Cell = row.insertCell();
    const ek2Btn = document.createElement("button");
    ek2Btn.textContent = "EK-2 Ekle/Değiştir";
    ek2Btn.onclick = () => openEK2Modal(idx);
    ek2Cell.appendChild(ek2Btn);

    const dosyaCell = row.insertCell();
    const fileBtn = document.createElement("input");
    fileBtn.type = "file";
    fileBtn.accept = ".pdf,.jpg,.jpeg,.tif,.tiff";
    dosyaCell.appendChild(fileBtn);

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

    row.ondblclick = () => showEK2History(idx);
    row.style.cursor = "pointer";
  });
}

function hesapla5YilSonra(tarih) {
  const [gun, ay, yil] = tarih.split(".");
  const dt = new Date(`${yil}-${ay}-${gun}`);
  dt.setFullYear(dt.getFullYear() + 5);
  return dt.toLocaleDateString("tr-TR").replaceAll("/", ".");
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  if (name && tc) {
    workplaces[currentWorkplace].employees.push({
      name,
      tc,
      ek2Tarihleri: []
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

function openEK2Modal(index) {
  selectedEmployeeIndex = index;
  document.getElementById("muayeneTarihi").value = new Date().toLocaleDateString("tr-TR").replaceAll("/", ".");
  document.getElementById("ek2Modal").style.display = "flex";
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
}

function saveEK2() {
  const tarih = document.getElementById("muayeneTarihi").value;
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(tarih)) {
    alert("Tarih hatalı. gg.aa.yyyy formatında olmalı.");
    return;
  }
  const emp = workplaces[currentWorkplace].employees[selectedEmployeeIndex];
  emp.ek2Tarihleri.push(tarih);
  saveData();
  loadEmployees();
  closeEK2();
}

function showEK2History(index) {
  const emp = workplaces[currentWorkplace].employees[index];
  const gecmis = emp.ek2Tarihleri?.join("\n") || "Küç kayıt yok";
  alert(`EK-2 Geçmişi:\n${gecmis}`);
}

function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}

// Tarih girişi formatlayıcı
document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5);
    e.target.value = v;
  }
});
