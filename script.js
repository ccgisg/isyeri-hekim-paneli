// Şifreli Giriş
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

// Global değişkenler
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

// Doktor bilgisi
function saveDoctorInfo() {
  const docName = document.getElementById("docName").value;
  const docDiploma = document.getElementById("docDiploma").value;
  localStorage.setItem("doctorInfo", JSON.stringify({ docName, docDiploma }));
  alert("Doktor bilgisi kaydedildi.");
}

// Çalışan işlemleri
function loadEmployees() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  const employees = workplaces[currentWorkplace].employees;
  employees.forEach((emp, idx) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = idx + 1; // sıra
    row.insertCell().innerText = emp.name;
    row.insertCell().innerText = emp.tc;
    row.insertCell().innerText = emp.sonMuayene || "";
    row.insertCell().innerText = emp.sonrakiMuayene || "";

    const ek2Cell = row.insertCell();
    const ek2Btn = document.createElement("button");
    ek2Btn.textContent = "EK-2";
    ek2Btn.onclick = () => openEK2(emp, idx);
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

    // çift tıklama ile geçmişi aç
    row.ondblclick = () => {
      alert("EK-2 geçmişi görüntüleme geliştiriliyor.");
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

// EK-2
function openEK2(emp, index) {
  const tarih = prompt("Muayene Tarihi (gg.aa.yyyy):");
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(tarih)) {
    alert("Tarih formatı yanlış!");
    return;
  }

  // tarihleri kaydet
  emp.sonMuayene = tarih;

  const parts = tarih.split(".");
  const nextDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  nextDate.setFullYear(nextDate.getFullYear() + 5);
  emp.sonrakiMuayene = `${String(nextDate.getDate()).padStart(2, "0")}.${String(nextDate.getMonth() + 1).padStart(2, "0")}.${nextDate.getFullYear()}`;

  saveData();
  loadEmployees();

  // Belge üret
  generateEK2Doc(emp, tarih);
}

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
        console.error("Şablon hatası:", error);
        alert("EK-2 oluşturulurken hata oluştu.");
      }
    });
}

// Excel Aktar/Al
function exportToExcel() {
  const ws_data = [["Ad Soyad", "TC", "Son Muayene", "Sonraki Muayene"]];
  const employees = workplaces[currentWorkplace].employees;
  employees.forEach(emp => {
    ws_data.push([emp.name, emp.tc, emp.sonMuayene, emp.sonrakiMuayene]);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Çalışanlar");
  XLSX.writeFile(wb, `calisanlar_${workplaces[currentWorkplace].name}.xlsx`);
}

function importFromExcel(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const newEmployees = [];

    rows.slice(1).forEach(row => {
      if (row[0] && row[1]) {
        newEmployees.push({
          name: row[0],
          tc: row[1],
          sonMuayene: row[2] || "",
          sonrakiMuayene: row[3] || ""
        });
      }
    });

    workplaces[currentWorkplace].employees = newEmployees;
    saveData();
    loadEmployees();
  };
  reader.readAsArrayBuffer(file);
}

// Otomatik nokta ekleme
document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5);
    e.target.value = v;
  }
});
