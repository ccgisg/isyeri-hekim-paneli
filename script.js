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
  const oldName = prompt("Düzenlemek istediğiniz işyeri adı:");
  const wp = workplaces.find(w => w.name === oldName);
  if (!wp) return alert("İşyeri bulunamadı");
  const newName = prompt("Yeni isim:", wp.name);
  if (newName) {
    wp.name = newName;
    saveData();
    loadWorkplaces();
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

    row.ondblclick = () => alert("EK-2 geçmişi geliştiriliyor.");
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

let selectedEmployee
