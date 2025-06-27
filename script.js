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

// Veri
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
  const name = prompt("Yeni işyeri adı:");
  if (name) {
    workplaces.push({ name, employees: [] });
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadWorkplaces();
  }
}

function editWorkplace() {
  const oldName = prompt("Düzenlenecek işyeri adı:");
  const wp = workplaces.find(w => w.name === oldName);
  if (wp) {
    const newName = prompt("Yeni adı:", wp.name);
    if (newName) {
      wp.name = newName;
      localStorage.setItem("workplaces", JSON.stringify(workplaces));
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
  const employees = workplaces[currentWorkplace].employees || [];

  employees.forEach((emp, i) => {
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
        employees.splice(i, 1);
        saveData();
        loadEmployees();
      }
    };
    row.insertCell().appendChild(delBtn);
  });
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC:");
  if (name && tc) {
    workplaces[currentWorkplace].employees.push({
      name, tc,
      sonMuayene: "", sonrakiMuayene: ""
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
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(tarih)) {
    alert("Tarih formatı gg.aa.yyyy olmalı.");
    return;
  }

  const emp = workplaces[currentWorkplace].employees[selectedIndex];
  emp.sonMuayene = tarih;

  const parts = tarih.split(".");
  const dt = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  dt.setFullYear(dt.getFullYear() + 5);
  const sonraki = dt.toLocaleDateString("tr-TR");
  emp.sonrakiMuayene = sonraki;

  saveData();
  loadEmployees();
  closeEK2();

  generateEK2Doc(emp.name, emp.tc, tarih);
}

// EK-2 Belge oluştur
function generateEK2Doc(adsoyad, tc, tarih) {
  const isyeri = workplaces[currentWorkplace].name;
  const doctor = JSON.parse(localStorage.getItem("doctorInfo") || "{}");

  PizZipUtils.getBinaryContent("ek2-template.docx", function (error, content) {
    if (error) {
      alert("Şablon yüklenemedi.");
      return;
    }
    const zip = new PizZip(content);
    const doc = new window.docxtemplater().loadZip(zip);
    doc.setData({
      adsoyad, tc, tarih, isyeri,
      doktor: doctor.docName || "",
      diploma: doctor.docDiploma || ""
    });
    try {
      doc.render();
    } catch (e) {
      alert("Belge oluşturulamadı.");
      return;
    }
    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, `EK2-${adsoyad}.docx`);
  });
}

// Kayıt
function saveData() {
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
}

// Nokta ekleyici (tarih girişine)
document.addEventListener("input", function (e) {
  if (e.target.id === "muayeneTarihi") {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "." + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "." + v.slice(5, 9);
    e.target.value = v;
  }
});
