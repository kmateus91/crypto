const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signupButton = document.getElementById("signupButton");

signupButton.addEventListener('click', (event) => {
  event.preventDefault();
  signupCall(
    firstNameInput.value,
    lastNameInput.value,
    emailInput.value,
    passwordInput.value
  )
}, false);

const signupCall = (first_name, last_name, email, password) => {
  axios.post('http://localhost:5000/api/v1/user', { email, password, first_name, last_name })
    .then(_ => {
      alert("Te has registrado correctamente");
      window.location = 'login.html';
    })
    .catch(error => console.error(error));
};
