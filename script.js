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

// Veriler
let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = null;
let selectedEmployeeIndex = null;

// İşyerleri
function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach((wp, i) => {
    const li = document.createElement("li");
    li.textContent = wp.name;
    li.style.cursor = "pointer";
    li.ondblclick = () => openWorkplace(i);
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

// Doktor
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
  const list = workplaces[currentWorkplace].employees;
  list.forEach((emp, i) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = i + 1;
    row.insertCell().innerText = emp.name;
    row.insertCell().innerText = emp.tc;
    row.insertCell().innerText = emp.sonMuayene || "";
    row.insertCell().innerText = emp.sonrakiMuayene || "";

    const ek2Cell = row.insertCell();
    const ek2Btn = document.createElement("button");
    ek2Btn.innerText = "EK-2";
    ek2Btn.onclick = () => openEK2(i);
    ek2Cell.appendChild(ek2Btn);

    const fileCell = row.insertCell();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.tif,.tiff";
    fileCell.appendChild(fileInput);

    const editCell = row.insertCell();
    const editBtn = document.createElement("button");
    editBtn.innerText = "Düzenle";
    editBtn.onclick = () => editEmployee(i);
    editCell.appendChild(editBtn);

    const delCell = row.insertCell();
    const delBtn = document.createElement("button");
    delBtn.innerText = "Sil";
    delBtn.onclick = () => {
      if (confirm("Silinsin mi?")) {
        list.splice(i, 1);
        saveData();
        loadEmployees();
      }
    };
    delCell.appendChild(delBtn);

    row.ondblclick = () => showEK2History(i);
    row.style.cursor = "pointer";
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC:");
  if (name && tc) {
    workplaces[currentWorkplace].employees.push({
      name,
      tc,
      sonMuayene: "",
      sonrakiMuayene: "",
      history: []
    });
    saveData();
    loadEmployees();
  }
}

function editEmployee(index) {
  const emp = workplaces[currentWorkplace].employees[index];
  const name = prompt("Ad Soyad:", emp.name);
  const tc = prompt("TC:", emp.tc);
  if (name && tc) {
    emp.name = name;
    emp.tc = tc;
    saveData();
    loadEmployees();
  }
}

// EK-2
function openEK2(index) {
  selectedEmployeeIndex = index;
  document.getElementById("muayeneTarihi").value = "";
  document.getElementById("ek2Modal").style.display = "flex";
}

function saveEK2() {
  const tarih = document.getElementById("muayeneTarihi").value;
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(tarih)) return alert("Tarih biçimi geçersiz!");

  const emp = workplaces[currentWorkplace].employees[selectedEmployeeIndex];
  emp.sonMuayene = tarih;

  const parts = tarih.split(".");
  const next = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  next.setFullYear(next.getFullYear() + 5);
  const sonraki =
    String(next.getDate()).padStart(2, "0") + "." +
    String(next.getMonth() + 1).padStart(2, "0") + "." +
    next.getFullYear();

  emp.sonrakiMuayene = sonraki;
  emp.history = emp.history || [];
  emp.history.push({ tarih });

  saveData();
  closeEK2();
  loadEmployees();
  generateEK2Doc(emp, tarih);
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
}

// Geçmiş
function showEK2History(index) {
  const emp = workplaces[currentWorkplace].employees[index];
  const list = document.getElementById("ek2HistoryList");
  list.innerHTML = "";

  if (!emp.history || emp.history.length === 0) {
    list.innerHTML = "<li>Kayıt yok.</li>";
  } else {
    emp.history.forEach(h => {
      const li = document.createElement("li");
      li.innerText = h.tarih;
      li.style.cursor = "pointer";
      li.onclick = () => generateEK2Doc(emp, h.tarih);
      list.appendChild(li);
    });
  }

  document.getElementById("historyModal").style.display = "flex";
}

function closeHistory() {
  document.getElementById("historyModal").style.display = "none";
}

// Tarih girişinde nokta otomatik
document.addEventListener("input", e => {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5);
    e.target.value = v;
  }
});

// Excel
function exportToExcel() {
  alert("Excel'e Aktar özelliği geliştiriliyor...");
}
function importFromExcel() {
  alert("Excel'den Al özelliği geliştiriliyor...");
}

// EK-2 belge üretimi (Docxtemplater gibi sistemler için placeholder fonksiyon)
function generateEK2Doc(emp, tarih) {
  alert(`EK-2 oluşturuluyor:\nAd Soyad: ${emp.name}\nTC: ${emp.tc}\nTarih: ${tarih}`);
}

// Veri kaydet
function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}
