var s = io();
var leader;
var accountList = [];

setTimeout(callback, 100);

function callback() {
  leader = document.getElementById("leader");
  s.emit("getAccountListSorted");

  var dashboardButton = document.getElementById("dashboard");
  dashboardButton.addEventListener("click", () => {
    window.location = "/dashboard";
  });
}

function accountCallback() {
  for (var i of accountList) {
    s.emit("getStats", i);
  }
}

s.on("accountList", d => {
  accountList = d;
  setTimeout(accountCallback, 100);
});

s.on("stats", d => {
  var p = document.createElement("p");
  var space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  p.innerHTML = "<b>" + (d[0] == localStorage.getItem("username") ? "" : "</b>") + d[0] + space + `$${d[1].money}` + space + d[1].wins + space + d[1].losses + space + d[1].draws + (d[0] == localStorage.getItem("username") ? "</b>" : "");
  leader.append(p);
});
