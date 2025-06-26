
function login() {
  const pw = document.getElementById("password").value;
  if (pw === "hekim2025") {
    document.getElementById("panel").style.display = "block";
    loadEmployees();
  } else {
    alert("Yanlış şifre");
  }
}

function addWorkplace() {
  const name = prompt("İşyeri adı giriniz:");
  if (name) {
    const li = document.createElement("li");
    li.innerText = name;
    document.getElementById("workplaceList").appendChild(li);
  }
}

function addEmployee() {
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const today = new Date().toISOString().split('T')[0];
  const next = new Date();
  next.setFullYear(next.getFullYear() + 5);
  const nextDate = next.toISOString().split('T')[0];

  if (name && tc) {
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    employees.push({ name, tc, date: today, next: nextDate });
    localStorage.setItem("employees", JSON.stringify(employees));
    loadEmployees();
  }
}

function loadEmployees() {
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  employees.forEach((emp, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.tc}</td>
      <td>${emp.date}</td>
      <td>${emp.next}</td>
      <td><button onclick="editEmployee(${index})">Düzenle</button></td>
      <td><button onclick="deleteEmployee(${index})">Sil</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function editEmployee(index) {
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  const emp = employees[index];
  const name = prompt("Ad Soyad:", emp.name);
  const tc = prompt("TC Kimlik No:", emp.tc);
  const date = prompt("Son Muayene Tarihi:", emp.date);
  const next = prompt("Sonraki Muayene Tarihi:", emp.next);
  if (name && tc && date && next) {
    employees[index] = { name, tc, date, next };
    localStorage.setItem("employees", JSON.stringify(employees));
    loadEmployees();
  }
}

function deleteEmployee(index) {
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  if (confirm("Silmek istediğinize emin misiniz?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    loadEmployees();
  }
}

function saveDoctorInfo() {
  localStorage.setItem("doctorName", document.getElementById("docName").value);
  localStorage.setItem("doctorDiploma", document.getElementById("docDiploma").value);
  alert("Doktor bilgileri kaydedildi!");
}
