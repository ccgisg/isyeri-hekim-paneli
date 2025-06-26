
function addWorkplace() {
  const name = prompt("İşyeri adı:");
  if (name) {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => openWorkplace(name);
    document.getElementById("workplaceList").appendChild(li);
  }
}

function openWorkplace(name) {
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = name;
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
}

function saveDoctorInfo() {
  alert("Doktor bilgileri kaydedildi.");
}

function addEmployee() {
  const table = document.getElementById("employeeTable").getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  row.insertCell(0).innerText = prompt("Ad Soyad:");
  row.insertCell(1).innerText = prompt("TC:");
  row.insertCell(2).innerText = prompt("Son Muayene (YYYY-AA-GG):");
  row.insertCell(3).innerText = prompt("Sonraki Muayene (YYYY-AA-GG):");
}
