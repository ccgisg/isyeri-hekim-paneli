
// Basit giriş
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

// Veriler
let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = null;

// İş yeri işlemleri
function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach((wp, index) => {
    const li = document.createElement("li");
    li.textContent = wp.name;
    li.onclick = () => openWorkplace(index);
    list.appendChild(li);
  });
}

function addWorkplace() {
  const name = prompt("İşyeri adı girin:");
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
    const newName = prompt("Yeni ad:", wp.name);
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
  document.getElementById("mainView").style.display = "block";
  document.getElementById("workplaceView").style.display = "none";
}

// Doktor kaydet
function saveDoctorInfo() {
  const name = document.getElementById("docName").value;
  const diploma = document.getElementById("docDiploma").value;
  localStorage.setItem("doctorInfo", JSON.stringify({ name, diploma }));
  alert("Doktor bilgileri kaydedildi.");
}

// Çalışan işlemleri
function loadEmployees() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  const emps = workplaces[currentWorkplace].employees || [];
  emps.forEach((emp, i) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = emp.name;
    row.insertCell().innerText = emp.tc;
    row.insertCell().innerText = emp.sonMuayene || "";
    row.insertCell().innerText = emp.sonrakiMuayene || "";

    const ek2Btn = document.createElement("button");
    ek2Btn.textContent = "EK-2";
    ek2Btn.onclick = () => openEK2(i);
    row.insertCell().appendChild(ek2Btn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Düzenle";
    editBtn.onclick = () => editEmployee(i);
    row.insertCell().appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Sil";
    delBtn.onclick = () => {
      if (confirm("Silinsin mi?")) {
        emps.splice(i, 1);
        saveData();
        loadEmployees();
      }
    };
    row.insertCell().appendChild(delBtn);
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  if (name && tc) {
    workplaces[currentWorkplace].employees.push({
      name, tc, sonMuayene: "", sonrakiMuayene: ""
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

// EK-2 Modal işlemleri
let selectedIndex = null;
function openEK2(index) {
  selectedIndex = index;
  document.getElementById("muayeneTarihi").value = "";
  document.getElementById("ek2Modal").style.display = "flex";
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
}

function saveEK2() {
  const tarih = document.getElementById("muayeneTarihi").value;
  if (!/\d{2}\.\d{2}\.\d{4}/.test(tarih)) {
    alert("Tarih formatı gg.aa.yyyy olmalı.");
    return;
  }

  const emp = workplaces[currentWorkplace].employees[selectedIndex];
  emp.sonMuayene = tarih;

  const d = tarih.split(".");
  const dt = new Date(`${d[2]}-${d[1]}-${d[0]}`);
  dt.setFullYear(dt.getFullYear() + 5);
  emp.sonrakiMuayene = dt.toLocaleDateString("tr-TR");

  saveData();
  loadEmployees();
  closeEK2();

  generateEK2Doc(emp.name, emp.tc, tarih);
}

// EK-2 Word oluştur
function generateEK2Doc(adsoyad, tc, tarih) {
  const isyeri = workplaces[currentWorkplace].name;
  const doktorInfo = JSON.parse(localStorage.getItem("doctorInfo") || "{}");
  PizZipUtils.getBinaryContent("ek2-template.docx", function (err, content) {
    if (err) {
      alert("Şablon yüklenemedi.");
      return;
    }
    const zip = new PizZip(content);
    const doc = new window.docxtemplater().loadZip(zip);
    doc.setData({
      adsoyad, tc, tarih, isyeri,
      doktor: doktorInfo.name || "", diploma: doktorInfo.diploma || ""
    });
    try {
      doc.render();
    } catch (e) {
      alert("Belge oluşturulamadı.");
      return;
    }
    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, "EK2-" + adsoyad + ".docx");
  });
}

// Kayıt
function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}

// Nokta otomatik
document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0,2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0,5) + "." + v.slice(5,9);
    e.target.value = v;
  }
});
