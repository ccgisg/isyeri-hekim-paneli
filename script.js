// Basit giriş kontrolü ve EK-2 belge üretimi örneği
function login() {
  const password = document.getElementById("password").value;
  if (password === "hekim2025") {
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("mainView").style.display = "block";
  } else {
    alert("Şifre yanlış!");
  }
}
function saveEK2() {
  const tarih = document.getElementById("muayeneTarihi").value;
  const adsoyad = "Örnek Ad";
  const tc = "12345678901";
  const isyeri = "Örnek İşyeri";
  const doktor = localStorage.getItem("doctorInfo") ? JSON.parse(localStorage.getItem("doctorInfo")).docName : "";
  const diploma = localStorage.getItem("doctorInfo") ? JSON.parse(localStorage.getItem("doctorInfo")).docDiploma : "";

  PizZipUtils.getBinaryContent("ek2-template.docx", function (error, content) {
    if (error) throw error;
    const zip = new PizZip(content);
    const doc = new window.docxtemplater().loadZip(zip);
    doc.setData({ adsoyad, tc, tarih, isyeri, doktor, diploma });
    try {
      doc.render();
    } catch (error) {
      alert("Belge işleme hatası: " + error.message);
      return;
    }
    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, "EK-2-" + adsoyad + ".docx");
  });
}
