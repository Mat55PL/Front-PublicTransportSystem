// if click button with id add, then show window
document.getElementById("add").addEventListener("click", function () {
  document.getElementById("window_entrance").classList.add("opened");
  document.getElementById("window_overlay").classList.add("opened");
});
// if click button with class window_close, then hide window
document.querySelector(".window_close").addEventListener("click", function () {
  document.getElementById("window_entrance").classList.remove("opened");
  document.getElementById("window_overlay").classList.remove("opened");
});
//sprawdz czy wszystkie dane w formularzu form są wypełnione
document.getElementById("form").addEventListener("submit", function (e) {
  var brand = document.getElementById("brand").value;
  var model = document.getElementById("model").value;
  var year = document.getElementById("year").value;
  var number = document.getElementById("number").value;
  if (brand == "" || model == "" || year == "" || number == "") {
    e.preventDefault(); //zatrzymaj wysyłanie formularza do serwera
    if (brand == "") {
      document.getElementById("brand").style.borderBottomColor = "#ec3f22";
    }
    if (model == "") {
      document.getElementById("model").style.borderBottomColor = "#ec3f22";
    }
    if (year == "") {
      document.getElementById("year").style.borderBottomColor = "#ec3f22";
    }
    if (number == "") {
      document.getElementById("number").style.borderBottomColor = "#ec3f22";
    }
  }
});
