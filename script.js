
function login() {
  const pw = document.getElementById("password").value;
  if (pw === "hekim2025") {
    document.getElementById("panel").style.display = "block";
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

function loadFromSheet() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTWf8NvVu3ygpeAhAxJ78sy59WPaIGC531ZwVN22Nq3ycaJxZbDDfrjvL-7A9Nf6RLhvjUwQpeaNtBv/pub?output=csv")
    .then(r => r.text())
    .then(data => {
      const rows = data.trim().split("\n");
      const tbody = document.querySelector("#employeeTable tbody");
      tbody.innerHTML = "";
      rows.slice(1).forEach(row => {
        const [name, tc] = row.split(",");
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${name}</td><td>${tc}</td>
                        <td><button onclick="this.closest('tr').remove()">Sil</button></td>
                        <td><button onclick="editRow(this)">Düzenle</button></td>`;
        tbody.appendChild(tr);
      });
    });
}

function editRow(btn) {
  const tr = btn.closest("tr");
  const name = prompt("Yeni Ad Soyad", tr.children[0].innerText);
  const tc = prompt("Yeni TC", tr.children[1].innerText);
  if (name && tc) {
    tr.children[0].innerText = name;
    tr.children[1].innerText = tc;
  }
}

function saveDoctorInfo() {
  localStorage.setItem("doctorName", document.getElementById("docName").value);
  localStorage.setItem("doctorDiploma", document.getElementById("docDiploma").value);
  alert("Bilgiler kaydedildi!");
}
