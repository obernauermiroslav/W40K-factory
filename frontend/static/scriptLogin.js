const signupForm = document.querySelector('#main-form');

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  postFirst();
});

function postFirst() {
  const username = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#passwordConfirmation').value;

  if (password !== confirmPassword) {
    alert("Passwords don't match");
    return;
  }

  fetch(`http://localhost:3000/signup`, {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log('Adding user to database');
        window.location.href = "http://localhost:3000/main";
      } else {
        console.error('Error adding user to database');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const facebookButton = document.querySelector(".facebook");

facebookButton.addEventListener("click", function() {
  window.location.href = "https://www.facebook.com/";
});

const twitterButton = document.querySelector('.twitter');

twitterButton.addEventListener('click', () => {
  window.location.href = 'https://twitter.com/';
});

const googleButton = document.querySelector('.google');

googleButton.addEventListener('click', () => {
  window.location.href = 'https://google.com/';
});