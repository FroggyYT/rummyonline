var s = io();

var loggedIn = localStorage.getItem("logged-in") == "true" ? true : false;

if (loggedIn) {
  s.emit("checkLoggedInValidation", [localStorage.getItem("username") + "", localStorage.getItem("password") + ""]);
}

s.on("logInValidation", d => {
  if (d) {
    window.location = "/dashboard";
  }
});


setTimeout(callback, 100);

function callback() {
  var usernameBox = document.getElementById("username");
  var passwordBox = document.getElementById("password");
  var loginButton = document.getElementById("login");
  var signupButton = document.getElementById("signup");

  loginButton.addEventListener("click", () => {
    s.emit("login", [usernameBox.value, passwordBox.value]);
  });

  signupButton.addEventListener("click", () => {
    s.emit("signup", [usernameBox.value, passwordBox.value]);
  });
}

s.on("loginFail", d => {
  alert(d);
});

s.on("signupFail", d => {
  alert(d);
});

s.on("loginSuccess", d => {
  window.location = "/dashboard";
  localStorage.setItem("logged-in", true);
  localStorage.setItem("username", usernameBox.value);
  localStorage.setItem("password", passwordBox.value);
});

s.on("signupSuccess", d => {
  window.location = "/dashboard";
  localStorage.setItem("logged-in", true);
  localStorage.setItem("username", usernameBox.value);
  localStorage.setItem("password", passwordBox.value);
});

s.on("call", d => {
  new Function(d)();
});
