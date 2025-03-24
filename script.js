const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sign Up
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Welcome to Whispr!");
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Logged in!");
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// Post Content
function postContent() {
  const content = document.getElementById("postContent").value;
  const user = auth.currentUser;

  if (user && content.trim()) {
    db.collection("posts").add({
      userId: user.uid,
      content: content.trim(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById("postContent").value = "";
  }
}

// Realtime Feed
auth.onAuthStateChanged(user => {
  if (user && document.getElementById("feed")) {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      const feed = document.getElementById("feed");
      feed.innerHTML = "";
      snapshot.forEach(doc => {
        feed.innerHTML += `<p>${doc.data().content}</p>`;
      });
    });
  }

  if (user && document.getElementById("chat")) {
    db.collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
      const chat = document.getElementById("chat");
      chat.innerHTML = "";
      snapshot.forEach(doc => {
        chat.innerHTML += `<p>${doc.data().text}</p>`;
      });
    });
  }
});

// Send Message
function sendMessage() {
  const message = document.getElementById("message").value;
  const user = auth.currentUser;

  if (user && message.trim()) {
    db.collection("messages").add({
      userId: user.uid,
      text: message.trim(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById("message").value = "";
  }
}
