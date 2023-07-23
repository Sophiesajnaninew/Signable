var btnLogin = document.getElementById('do-login');
var idLogin = document.getElementById('login');
var username = document.getElementById('username');
btnLogin.onclick = function(){
  idLogin.innerHTML = '<h1>It\'s study time, </h1><h2>' +username.value+ '</h2>';
    
  const button = document.createElement("button");
  button.className = "button";
  button.innerText = "Begin";
  button.addEventListener('click', myFunction);
  function myFunction() {
    window.location.href = "dashboard.html"
  }
  document.body.appendChild(button)

}

