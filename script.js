
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    loadWorkplaces();
  }
});

function login() {
  const password = document.getElementById("password").value;
  if (password === "hekim2025") {
    localStorage.setItem("loggedIn", "true");
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    loadWorkplaces();
  } else {
    alert("Şifre yanlış!");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  location.reload();
}

function saveDoctorInfo() {
  localStorage.setItem("doctorName", document.getElementById("docName").value);
  localStorage.setItem("doctorDiploma", document.getElementById("docDiploma").value);
  alert("Doktor bilgileri kaydedildi.");
}

function addWorkplace() {
  const name = prompt("Yeni işyeri adı:");
  if (!name) return;
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  workplaces.push({ name, employees: [] });
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
  loadWorkplaces();
}

function editWorkplace() {
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  const names = workplaces.map(w => w.name).join("\n");
  const oldName = prompt("Düzenlenecek işyeri adı:\n" + names);
  if (!oldName) return;
  const newName = prompt("Yeni adı:");
  const wp = workplaces.find(w => w.name === oldName);
  if (wp && newName) {
    wp.name = newName;
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadWorkplaces();
  }
}

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  workplaces.forEach(wp => {
    const li = document.createElement("li");
    li.textContent = wp.name;
    li.ondblclick = () => openWorkplace(wp.name);
    list.appendChild(li);
  });
}

let currentWorkplace = "";

function openWorkplace(name) {
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = name;
  currentWorkplace = name;
  loadEmployees();
}

function goBack() {
  document.getElementById("mainView").style.display = "block";
  document.getElementById("workplaceView").style.display = "none";
}

function addEmployee() {
  const adsoyad = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  if (!adsoyad || !tc) return;
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  const wp = workplaces.find(w => w.name === currentWorkplace);
  if (wp) {
    wp.employees.push({ adsoyad, tc, son: "", sonraki: "" });
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadEmployees();
  }
}

function loadEmployees() {
  const tbody = document.getElementById("employeeTable").querySelector("tbody");
  tbody.innerHTML = "";
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  const wp = workplaces.find(w => w.name === currentWorkplace);
  if (!wp) return;
  wp.employees.forEach((e, i) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = e.adsoyad;
    row.insertCell().innerText = e.tc;
    row.insertCell().innerText = e.son;
    row.insertCell().innerText = e.sonraki;
    row.insertCell().innerHTML = "<button onclick='editEmployee(" + i + ")'>Düzenle</button>";
    row.insertCell().innerHTML = "<button onclick='deleteEmployee(" + i + ")'>Sil</button>";
    row.ondblclick = () => openEK2(i);
  });
}

function deleteEmployee(index) {
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  const wp = workplaces.find(w => w.name === currentWorkplace);
  if (!wp) return;
  wp.employees.splice(index, 1);
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
  loadEmployees();
}

function editEmployee(index) {
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  const wp = workplaces.find(w => w.name === currentWorkplace);
  if (!wp) return;
  const e = wp.employees[index];
  const ad = prompt("Ad Soyad:", e.adsoyad);
  const tc = prompt("TC:", e.tc);
  if (ad && tc) {
    e.adsoyad = ad;
    e.tc = tc;
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadEmployees();
  }
}

let currentEmpIndex = null;

function openEK2(index) {
  document.getElementById("ek2Modal").style.display = "flex";
  currentEmpIndex = index;
  document.getElementById("muayeneTarihi").value = "";
}

function closeEK2() {
  document.getElementById("ek2Modal").style.display = "none";
}

function saveEK2() {
  const date = document.getElementById("muayeneTarihi").value;
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
    alert("Tarih formatı yanlış (gg.aa.yyyy)");
    return;
  }
  const [gg, aa, yyyy] = date.split(".");
  const sonTarih = `${gg}.${aa}.${yyyy}`;
  const sonrakiTarih = `${gg}.${aa}.${parseInt(yyyy) + 5}`;

  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  const wp = workplaces.find(w => w.name === currentWorkplace);
  if (!wp) return;
  const emp = wp.employees[currentEmpIndex];
  emp.son = sonTarih;
  emp.sonraki = sonrakiTarih;
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
  closeEK2();
  loadEmployees();
}

document.getElementById("muayeneTarihi")?.addEventListener("input", function () {
  let val = this.value.replace(/[^0-9]/g, "").slice(0, 8);
  if (val.length >= 5)
    this.value = val.slice(0, 2) + "." + val.slice(2, 4) + "." + val.slice(4);
  else if (val.length >= 3)
    this.value = val.slice(0, 2) + "." + val.slice(2);
  else this.value = val;
});
