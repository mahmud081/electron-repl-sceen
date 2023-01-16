const { ipcRenderer } = require("electron");

document.querySelectorAll(".nav-item .nav-link").forEach((el) => {
  el.addEventListener("click", (e) => {
    let pageName = e.target.dataset.link;
    ipcRenderer.invoke("change-page", pageName);
  });
});
