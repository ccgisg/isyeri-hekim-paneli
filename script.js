const PASSWORD = "hekim2025";

function login() {
  const pw = document.getElementById("password").value;
  if (pw === PASSWORD) {
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Şifre yanlış!");
  }
}

function addWorkplace() {
  const name = prompt("İş yeri adı:");
  if (!name) return;

  const li = document.createElement("li");
  li.textContent = name;
  li.onclick = () => loadEmployees(name);
  document.getElementById("workplaceList").appendChild(li);
}

let currentWorkplace = "";

function loadEmployees(name) {
  currentWorkplace = name;
  document.getElementById("employeeTable").querySelector("tbody").innerHTML = "";
}

function addEmployee() {
  if (!currentWorkplace) return alert("Önce bir iş yeri seçin");

  const name = prompt("Ad Soyad:");
  const tc = prompt("TC Kimlik No:");
  const today = new Date().toISOString().split("T")[0];
  const next = new Date();
  next.setFullYear(next.getFullYear() + 5);
  const nextDate = next.toISOString().split("T")[0];

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${name}</td>
    <td>${tc}</td>
    <td>${today}</td>
    <td>${nextDate}</td>
    <td><button onclick="editRow(this)">Düzenle</button></td>
    <td><button onclick="deleteRow(this)">Sil</button></td>
  `;
  document.getElementById("employeeTable").querySelector("tbody").appendChild(tr);
}

function deleteRow(btn) {
  btn.closest("tr").remove();
}

function editRow(btn) {
  const tr = btn.closest("tr");
  const name = prompt("Ad Soyad:", tr.cells[0].textContent);
  const tc = prompt("TC Kimlik No:", tr.cells[1].textContent);
  const last = prompt("Son Muayene:", tr.cells[2].textContent);
  const next = prompt("Sonraki Muayene:", tr.cells[3].textContent);

  tr.cells[0].textContent = name;
  tr.cells[1].textContent = tc;
  tr.cells[2].textContent = last;
  tr.cells[3].textContent = next;
}

function saveDoctorInfo() {
  const name = document.getElementById("docName").value;
  const diploma = document.getElementById("docDiploma").value;
  alert("Kaydedildi: " + name + " - " + diploma);
}
