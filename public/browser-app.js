const usernameDOM = document.querySelector(".login-username");
const passwordDOM = document.querySelector(".login-password");
const formDOM = document.querySelector(".login-form");
const formAlertDOM = document.querySelector(".form-alert");

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uname = usernameDOM.value;
  const pass = passwordDOM.value;

  // todo use bootstrap client-side validation for username & password
  //the error message displays only for one second
  const blankError = () => {
    formAlertDOM.innerHTML = "<h4>enter some value</h4>";
    setTimeout(async () => {
      formAlertDOM.innerHTML = "";
    }, 1000);
  };
  if (!uname || !pass) {
    return blankError();
  }
  try {
    // const user = { uname, password };
    // const response = await fetch("api/v1/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify(user),
    // });
    await axios.post("api/v1/auth/login", {
      username: uname,
      password: pass,
    });

    // if (response.status == 200) {

    usernameDOM.value = "";
    passwordDOM.value = "";
    formAlertDOM.innerHTML = "<h4>SUCCESSFULLY LOGGED IN</h4>";
  } catch (error) {
    console.log(error);
  }
});
