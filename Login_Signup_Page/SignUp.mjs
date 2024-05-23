import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,FacebookAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, set,update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBalzYIBKKPbqOpOO-N4HGS6yEH47AP8Dg",
    authDomain: "login-for-internship.firebaseapp.com",
    projectId: "login-for-internship",
    storageBucket: "login-for-internship.appspot.com",
    messagingSenderId: "68321352584",
    appId: "1:68321352584:web:13bb3b568cc969f7c2f83d"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize variables
const auth = getAuth();
auth.languageCode='en';
const database = getDatabase();      

// Function to handle signup
function signup() {
  // Input from fields (trim leading/trailing spaces)
  let name = document.getElementById('name').value.trim();
  let phone = document.getElementById('phone').value;
  let email = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  // Basic email format validation
  const emailRegex = /^[^@]+@\w+(\.\w+)+\w$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Minimum password length validation
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  // Sign up user with Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User creation successful
      var user = userCredential.user;

      // Create user data object
      var userData = {
        name: name,
        phone: phone,
        email: email,
        lastLogin: Date.now() // Timestamp for last login
      };

      // Add user data to Firebase Realtime Database (optional)
      set(ref(database, 'users/' + email.replace(/\./g, ',')), userData)

        .then(() => {
          // User data saved successfully
          alert("Signup successful! You can now log in.");
          window.location.href = "login.html";
        })
        .catch((error) => {
          // Error saving user data to database
          console.error("Error saving user data:", error);
        });
    })
    .catch((error) => {
      // Handle errors during user creation
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage); // Display error message to user
    });
}


function login(){
  let email = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      
      // Update last login time in Firebase Realtime Database
      const userRef = ref(database, 'users/' + user.email.replace(/\./g, ','));
      update(userRef, { lastLogin: Date.now() })
      .then(() => {
          window.location.href = "success_page.html"; // Redirect to index.html or any other page
      })
      .catch((error) => {
          // Error updating last login time
          console.error("Error updating last login time:", error);
      });
  })
  .catch((error) => {
      // Handle login errors
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage); // Display error message to user
  });
}

let loginButton = document.getElementById('login');
if(loginButton){
  loginButton.addEventListener('click',function(event){
      event.preventDefault();
      login();
  });
}


// Attach event listener to signup button (assuming it has an ID of "signup")
var signupButton = document.getElementById("signup");
if (signupButton) {
  signupButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    signup();
  });
}