// Bu script örnek olarak hazırlandı. Gerçek işlevsellik devamında eklenecek
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
// Devamı eklenecek...
