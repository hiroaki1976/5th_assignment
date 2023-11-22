// 必要なFirebaseライブラリを読み込み
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// FirebaseConfig（これは絶対githubには上げない！！！）
const firebaseConfig = {

    };
const app = initializeApp(firebaseConfig);

// GoogleAuth（認証用）
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();

// login処理
$('#login').on('click',function(){
//google認証完了後の処理
signInWithPopup(auth, provider).then((result) => {
    //login後のページ遷移
    location.href = 'index.html';
}).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
});
});
