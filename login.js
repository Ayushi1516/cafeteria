document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    const userEmail = document.getElementById("email").value.trim();
    const userPassword = document.getElementById("password").value;
    const message = document.getElementById("message");

    const userData = JSON.parse(localStorage.getItem("user"));
    message.textContent = "";
    if (userEmail == "" || userPassword == "") {
      message.textContent = "Enter required fields";
      message.className = "error";
      return;
    }
    const currenUser = userData.find(element => element.userEmail == userEmail && element.userPassword == userPassword);
    sessionStorage.setItem("currentUser", JSON.stringify(currenUser));
    if('navigation' in window){
        navigation.navigate('./dashboard.html')
    }
    alert("Logged In successfully!")
  });
});
