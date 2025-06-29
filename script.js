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

// Veri yapısı
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
    row.insertCell().innerText = idx + 1;
    row.insertCell().innerText = emp.name;
    row.insertCell().innerText = emp.tc;
    row.insertCell().innerText = emp.sonMuayene || "";
    row.insertCell().innerText = emp.sonrakiMuayene || "";

    const ek2Cell = row.insertCell();
    const ek2Btn = document.createElement("button");
    ek2Btn.textContent = "EK-2";
    ek2Btn.onclick = () => openEK2(idx);
    ek2Cell.appendChild(ek2Btn);

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
      sonrakiMuayene: ""
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

// EK-2 Belgesi Oluşturma
function openEK2(index) {
  const tarih = prompt("Muayene tarihi (gg.aa.yyyy):");
  if (!tarih || !/^\d{2}\.\d{2}\.\d{4}$/.test(tarih)) {
    alert("Tarih biçimi yanlış.");
    return;
  }

  const emp = workplaces[currentWorkplace].employees[index];
  emp.sonMuayene = tarih;

  const parts = tarih.split(".");
  const nextDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  nextDate.setFullYear(nextDate.getFullYear() + 5);
  const formattedNext = String(nextDate.getDate()).padStart(2, "0") + "." +
                        String(nextDate.getMonth() + 1).padStart(2, "0") + "." +
                        nextDate.getFullYear();
  emp.sonrakiMuayene = formattedNext;

  saveData();
  loadEmployees();

  generateEK2Doc(emp, tarih);
}

// EK-2 Word Belgesi Üretimi
function generateEK2Doc(emp, tarih) {
  const doktor = JSON.parse(localStorage.getItem("doctorInfo") || "{}");

  fetch("ek2-template.docx")
    .then(res => res.arrayBuffer())
    .then(content => {
      const zip = new PizZip(content);
      const doc = new window.docxtemplater().loadZip(zip);

      doc.setData({
        adsoyad: emp.name,
        tc: emp.tc,
        tarih: tarih,
        doktor: doktor.docName || "Dr. Belirtilmedi",
        diploma: doktor.docDiploma || "N/A",
        isyeri: workplaces[currentWorkplace].name
      });

      try {
        doc.render();
        const blob = doc.getZip().generate({ type: "blob" });
        saveAs(blob, `EK2-${emp.name}-${tarih}.docx`);
      } catch (error) {
        console.error("Şablon işleme hatası:", error);
        alert("Belge oluşturulurken hata oluştu.");
      }
    });
}
