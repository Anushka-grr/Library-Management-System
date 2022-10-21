const usernameDOM = document.querySelector(".username");
const passwordDOM = document.querySelector(".password");
const formDOM = document.querySelector(".register-form");
const formAlertDOM = document.querySelector(".form-alert");

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uname = usernameDOM.value;
  const pass = passwordDOM.value;
  //    todo encrypt pass in backend using bcrypt
  if (!uname || !pass) {
    return (formAlertDOM.innerHTML = "<h4>enter some value</h4>");
    // todo use bootstrap client-side validation for username & password
  }
  //checking if a user with the same username already exists and throwing an error/alert
  // const {
  //   data: { users },
  // } = await axios.get("api/v1/users");
  // //todo create a get request
  // const all = users.map((user) => {
  //   const { name } = user;
  //   if (name == uname) {
  //     return "<h4>USER ALREADY EXISTS</h4>";
  //   }
  // });

  // formAlertDOM.innerHTML = all;

  await axios.post("api/v1/auth/register", {
    username: uname,
    password: pass,
  });
  // await fetch("/api");
  usernameDOM.value = "";
  passwordDOM.value = "";
  formAlertDOM.innerHTML =
    "<h4> User Successfully registered!! Click below to login </h4>";
});
