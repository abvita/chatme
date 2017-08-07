//Anonymous authentication
auth.signInAnonymously().catch(function(error) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
      // ...
    } else {
      // User is signed out.
    }
    // ...
});

var checkSignedIn = function() {
  // Return true if the user is signed in Firebase
  if (auth.user){
    console.log("true");
    return true;
  } else {
    console.log("false");
    alert('Please sign-in first!');
    return false;
    }
};

signInButton.addEventListener("click", function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;
    var profilePicUrl = user.photoURL;
    userName = user.displayName;
    document.querySelector('#user-name').innerHTML = userName;
    document.querySelector("#user-pic").innerHTML = "<img src=" + profilePicUrl +" height='30px' width='30px'>";
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
  });
});
