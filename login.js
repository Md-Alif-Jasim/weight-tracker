import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {

  let isLogin = true;

  function switchForm() {
    isLogin = !isLogin;
    const formBox = document.querySelector('.form-box');
    if (isLogin) {
      document.querySelector('h1').textContent = 'Welcome Back';
      document.getElementById('submitBtn').textContent = 'Login';
      document.querySelector('.switch-text').innerHTML = 
        'Don\'t have an account? <span onclick="switchForm()">Create Account</span>';
      document.getElementById('firstName') && document.getElementById('firstName').remove();
      document.getElementById('lastName') && document.getElementById('lastName').remove();
      document.getElementById('confirmPassword') && document.getElementById('confirmPassword').remove();
    } else {
      document.querySelector('h1').textContent = 'Create Account';
      document.getElementById('submitBtn').textContent = 'Create Account';
      document.querySelector('.switch-text').innerHTML = 
        'Already have an account? <span onclick="switchForm()">Login</span>';
      const emailInput = document.getElementById('emailInput');
      const firstName = document.createElement('input');
      firstName.type = 'text';
      firstName.id = 'firstName';
      firstName.placeholder = 'First Name';
      const lastName = document.createElement('input');
      lastName.type = 'text';
      lastName.id = 'lastName';
      lastName.placeholder = 'Last Name';
      const confirmPassword = document.createElement('input');
      confirmPassword.type = 'password';
      confirmPassword.id = 'confirmPassword';
      confirmPassword.placeholder = 'Confirm Password';
      formBox.insertBefore(firstName, emailInput);
      formBox.insertBefore(lastName, emailInput);
      const submitBtn = document.getElementById('submitBtn');
formBox.insertBefore(confirmPassword, submitBtn);
    }
  }

  document.getElementById('submitBtn').addEventListener('click', async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    if (!email || !password) {
      alert('Please enter email and password!');
      return;
    }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        showTransition();
      } else {
        const confirm = document.getElementById('confirmPassword').value;
        if (password !== confirm) {
          alert('Passwords do not match!');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        showTransition();
      }
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelector('.google-btn').addEventListener('click', async function() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showTransition();
    } catch (error) {
      alert(error.message);
    }
  });

  function showTransition() {
    const screen = document.getElementById('transitionScreen');
    const welcomeText = document.getElementById('welcomeText');
    screen.style.display = 'flex';
    setTimeout(function() {
      welcomeText.textContent = 'Welcome! 👋';
      welcomeText.style.opacity = '1';
    }, 1500);
    setTimeout(function() {
window.location.href = 'dashboard.html';    }, 3000);
  }

  window.switchForm = switchForm;

});