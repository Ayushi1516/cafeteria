document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const userName = document.getElementById("name").value.trim();
    const userEmail = document.getElementById("email").value.trim();
    const userPassword = document.getElementById("password").value;
    const userContact = document.getElementById("contact").value;
    const message = document.getElementById("message");
    message.textContent = "";

    if (
      userName == "" ||
      userEmail == "" ||
      userPassword == "" ||
      userContact == ""
    ) {
      message.textContent = "Enter all details before submitting";
      message.className = "error";
      return;
    }
    if (userName.length < 3) {
      message.textContent = "userName must be atleast 3 characters.";
      message.className = "error";
      return;
    }

    const currentUser = { userName, userEmail, userPassword, userContact };

    const userData = getuserData() || [];
    const existingUser = userData
      ? userData.filter((user) => user.userEmail == currentUser.userEmail)
      : null;
    if (!existingUser || existingUser.length == 0) {
        userData.push(currentUser);
      saveUserData(userData);
       if('navigation' in window){
        navigation.navigate('./login.html')
      }
    } else {
      message.textContent = "User Already exists";
      message.className = "error";
      return;
    }
  });

  function saveUserData(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  function getuserData() {
    return JSON.parse(localStorage.getItem("user"));
  }
});
