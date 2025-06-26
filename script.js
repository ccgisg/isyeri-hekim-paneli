
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

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
  workplaces.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.ondblclick = () => openWorkplace(name);
    list.appendChild(li);
  });
}

function saveDoctorInfo() {
  alert("Doktor bilgileri kaydedildi.");
}

function addWorkplace() {
  const name = prompt("İşyeri adı:");
  if (name) {
    const workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
    workplaces.push(name);
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadWorkplaces();
  }
}

function editWorkplace() {
  alert("Düzenle fonksiyonu yakında aktif olacak.");
}

function openWorkplace(name) {
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = name;
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
  loadWorkplaces();
}

function addEmployee() {
  const table = document.getElementById("employeeTable").getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 5);
  const future = futureDate.toISOString().split('T')[0];

  row.insertCell(0).innerText = name;
  row.insertCell(1).innerText = tc;
  row.insertCell(2).innerText = today;
  row.insertCell(3).innerText = future;
  row.insertCell(4).innerHTML = '<button onclick="editEmployee(this)">Düzenle</button>';
  row.insertCell(5).innerHTML = '<button onclick="deleteEmployee(this)">Sil</button>';
}

function editEmployee(btn) {
  const row = btn.parentElement.parentElement;
  const name = prompt("Yeni Ad Soyad:", row.cells[0].innerText);
  const tc = prompt("Yeni TC:", row.cells[1].innerText);
  if (name && tc) {
    row.cells[0].innerText = name;
    row.cells[1].innerText = tc;
  }
}

function deleteEmployee(btn) {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    const row = btn.parentElement.parentElement;
    row.remove();
  }
}
