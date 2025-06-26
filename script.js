function login() {
  const password = document.getElementById("password").value;
  if (password === "hekim2025") {
    localStorage.setItem("login", "true");
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    loadWorkplaces();
  } else {
    alert("Şifre yanlış!");
  }
}

function logout() {
  localStorage.removeItem("login");
  location.reload();
}

window.onload = function () {
  if (localStorage.getItem("login") === "true") {
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    loadWorkplaces();
  }
};

function addWorkplace() {
  const name = prompt("İşyeri adı:");
  if (name) {
    const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
    workplaces.push({ name: name, employees: [] });
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadWorkplaces();
  }
}

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  workplaces.forEach((wp, i) => {
    const li = document.createElement("li");
    li.textContent = wp.name;
    li.ondblclick = () => openWorkplace(i);
    list.appendChild(li);
  });
}

let currentIndex = -1;

function openWorkplace(index) {
  currentIndex = index;
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  const workplaces = JSON.parse(localStorage.getItem("workplaces"));
  document.getElementById("currentWorkplaceTitle").innerText = workplaces[index].name;
  loadEmployees();
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
}

function saveDoctorInfo() {
  alert("Doktor bilgileri kaydedildi.");
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC:");
  if (!name || !tc) return;

  const workplaces = JSON.parse(localStorage.getItem("workplaces"));
  workplaces[currentIndex].employees.push({ name, tc, lastExam: "", nextExam: "" });
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
  loadEmployees();
}

function loadEmployees() {
  const table = document.getElementById("employeeTable").getElementsByTagName('tbody')[0];
  table.innerHTML = "";
  const workplaces = JSON.parse(localStorage.getItem("workplaces"));
  workplaces[currentIndex].employees.forEach((emp, i) => {
    const row = table.insertRow();
    row.ondblclick = () => openEk2Form(i);
    row.insertCell(0).innerText = emp.name;
    row.insertCell(1).innerText = emp.tc;
    row.insertCell(2).innerText = emp.lastExam;
    row.insertCell(3).innerText = emp.nextExam;
  });
}

let currentEmployeeIndex = -1;

function openEk2Form(empIndex) {
  currentEmployeeIndex = empIndex;
  document.getElementById("ek2FormModal").style.display = "block";
  document.getElementById("examDate").value = "";
}

function closeModal() {
  document.getElementById("ek2FormModal").style.display = "none";
}

function saveExamDate() {
  const date = document.getElementById("examDate").value;
  if (!date) return;
  const [day, month, year] = date.split(".");
  const examDate = new Date(`${year}-${month}-${day}`);
  const nextExamDate = new Date(examDate);
  nextExamDate.setFullYear(examDate.getFullYear() + 5);
  const nextFormatted = `${String(nextExamDate.getDate()).padStart(2, '0')}.${String(nextExamDate.getMonth()+1).padStart(2, '0')}.${nextExamDate.getFullYear()}`;

  const workplaces = JSON.parse(localStorage.getItem("workplaces"));
  workplaces[currentIndex].employees[currentEmployeeIndex].lastExam = date;
  workplaces[currentIndex].employees[currentEmployeeIndex].nextExam = nextFormatted;
  localStorage.setItem("workplaces", JSON.stringify(workplaces));
  closeModal();
  loadEmployees();
}

document.getElementById("examDate")?.addEventListener("input", function(e) {
  let val = e.target.value.replace(/\D/g, "");
  if (val.length > 2) val = val.slice(0,2) + "." + val.slice(2);
  if (val.length > 5) val = val.slice(0,5) + "." + val.slice(5,9);
  e.target.value = val;
});
