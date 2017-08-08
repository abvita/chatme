// Initialize Firebase
var config = {
  apiKey: "AIzaSyDpifD5DcERhBRC5BCYbFcKS7EmXMvNJnk",
  authDomain: "chatme-65ad0.firebaseapp.com",
  databaseURL: "https://chatme-65ad0.firebaseio.com",
  projectId: "chatme-65ad0",
  storageBucket: "chatme-65ad0.appspot.com",
  messagingSenderId: "472823093706"
};
firebase.initializeApp(config);

// Retrieves Firebase database, auth, and messaging objects
var database = firebase.database().ref();
var auth = firebase.auth();
var messaging = firebase.messaging();

// DOM element selector variables
var textInput = document.querySelector('#text');
var postButton = document.querySelector('#post');
var picButton = document.querySelector('#pic');
var anonSignInButton = document.querySelector("#anon-sign-in");
var signInButton = document.querySelector("#sign-in");
var signOutButton = document.querySelector("#sign-out");
var googlename = document.querySelector('#user-name');
var googlepic = document.querySelector("#user-pic");
var messageBox = document.getElementById("results");

// POSTS
// Function to add a data listener for new messages and populate message section
var startListening = function() {
  database.on('child_added', function(snapshot) {
    var msg = snapshot.val();
    var msgUsernameElement = document.createElement("b");
    var msgTextElement = document.createElement("p");
    var msgElement = document.createElement("div");
    msgUsernameElement.textContent = msg.username;
    msgTextElement.textContent = msg.text;
    msgElement.appendChild(msgUsernameElement);
    msgElement.appendChild(msgTextElement);
    msgElement.className = "msg";

    var msgList = messageBox.children;
    if (msgList.length <= 3) {
      messageBox.appendChild(msgElement);
    } else {
      messageBox.removeChild(msgList[0]);
      messageBox.appendChild(msgElement);
    }
  });
}

// AUTH FUNCTIONS
// Checks if user is signed in and populates DOM accordingly
auth.onAuthStateChanged(function(user) {
  if (user && !user.isAnonymous) { // User is signed in non-anonymously
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    googlename.innerHTML = displayName;
    googlepic.innerHTML = "<img src=" + photoURL +" height='30px' width='30px'>";
    googlename.style.visibility = "visible";
    googlepic.style.visibility = "visible";
    anonSignInButton.style.display = 'none';
    signInButton.style.display = 'none';
    signOutButton.style.display = 'inline';
    // Begin listening for data
    startListening();
  } else if (user && user.isAnonymous) { // User is signed in non-anonymously
    var displayName = "Guest";
    var photoURL = "#guesphotohere";
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    googlename.innerHTML = displayName;
    googlename.style.visibility = "visible";
    googlepic.style.display = 'none';
    signInButton.style.display = 'none';
    anonSignInButton.style.display = 'none';
    signOutButton.style.display = 'inline';
    // Begin listening for data
    startListening();
  } else { // User is not signed in
    googlename.style.visibility = "hidden";
    googlepic.style.visibility = "hidden";
    signInButton.style.display = 'inline';
    signOutButton.style.display = 'none';
  }
});

// Sign in Firebase using popup auth and Google as the identity provider.
var signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
  });
}

// Sign in Firebase using anonymous authentication
var anonSignIn = function () {
  auth.signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

// Sign out of Firebase.
var signOut = function() {
  auth.signOut();
  location.reload();
}

// Called when message is sent
var checkSignedIn = function() {
  // Return true if the user is signed in Firebase
  if (auth.currentUser) {
    return true;
  } else {
    alert('Please sign-in first!');
    return false;
  }
}

// Pushes new messages to database
var postMsg = function() {
  if (textInput.value && checkSignedIn()){ //Checks for google auth
    var currentUser = auth.currentUser;
    if (auth.currentUser.isAnonymous){ //Checks for anon auth
      var displayName = "Guest";
    } else {
      var displayName = currentUser.displayName;
    }
    var msgText = textInput.value;
    database.push({username:displayName, text:msgText});
    textInput.value = "";
  };
}

// NOTIFICATIONS
messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});

// EVENT LISTENERS
anonSignInButton.addEventListener("click", function() {
  anonSignIn();
});

signInButton.addEventListener("click", function() {
  signIn();
});

signOutButton.addEventListener("click", function() {
  signOut();
});

postButton.addEventListener("click", function() {
  postMsg();
});
