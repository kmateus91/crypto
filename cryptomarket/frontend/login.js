const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  loginCall(emailInput.value, passwordInput.value)
}, false);

const loginCall = (email, password) => {
  axios.post('http://localhost:5000/api/v1/token', { email, password })
    .then(response => {
      const data = response.data;
      localStorage.setItem('accessToken', data.data.token)
      window.location = 'index.html';
    })
    .catch(error => console.error(error));
};
