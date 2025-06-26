
let workplaces = JSON.parse(localStorage.getItem("workplaces") || "[]");
let currentWorkplace = "";

function login() {
  const pw = document.getElementById("password").value;
  if (pw === "hekim2025") {
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    loadWorkplaces();
  } else {
    alert("Şifre yanlış!");
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

function loadWorkplaces() {
  const list = document.getElementById("workplaceList");
  list.innerHTML = "";
  workplaces.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => openWorkplace(name);
    list.appendChild(li);
  });
}

function addWorkplace() {
  const name = prompt("Yeni işyeri adı:");
  if (name && !workplaces.includes(name)) {
    workplaces.push(name);
    localStorage.setItem("workplaces", JSON.stringify(workplaces));
    loadWorkplaces();
  } else if (workplaces.includes(name)) {
    alert("Bu isimde bir işyeri zaten var.");
  }
}

function openWorkplace(name) {
  currentWorkplace = name;
  document.getElementById("mainView").style.display = "none";
  document.getElementById("workplaceView").style.display = "block";
  document.getElementById("currentWorkplaceTitle").innerText = name;
}

function goBack() {
  document.getElementById("workplaceView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
}
