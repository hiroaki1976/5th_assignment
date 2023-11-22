// Import the functions you need from the SDKs you need
import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, update, onChildChanged }
    from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Your web app's Firebase configuration
// FirebaseConfigをfirebase_api.jsからimport
import {firebaseConfig} from "../setting/firebase_api.js"
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app); //RealtimeDBに接続
    // const dbRef = ref(db, 'chat/'+uid); //RealtimeDB内の"chat"を使う

// GoogleAuth（認証用）
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();

// loginしてたら行なう処理
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const dbRef = ref(db, 'chat/'+uid); //RealtimeDB内の"chat"を使う
        // ユーザー情報取得できます
        if (user !== null) {
            user.providerData.forEach((profile) => {
                // Login情報取得
                $('#uname').text(profile.displayName);
                $('#prof').attr("src", profile.photoURL);   
            });
            $('#status').fadeOut(2000);
        }
        //データ登録send1(Click)
        $('#send1').on('click', function () {
            const value = $('#send1').attr('value');
            const msg = {
                name: $("#name1").val(),
                text: $("#text1").val(),
                value: value
            }
            const newPostRef = push(dbRef);//ユニークKEYを生成（これをつけないとデータが上書きされる）
            set(newPostRef, msg);//"chat"にユニークKEYをつけてオブジェクトデータを登録

            $('#text1').val('');
        });


        //データ登録send2(Click)
        $('#send2').on('click', function () {
            const value = $('#send2').attr('value');
            const msg = {
                name: $("#name2").val(),
                text: $("#text2").val(),
                value: value
        }
        const newPostRef = push(dbRef);//ユニークKEYを生成（これをつけないとデータが上書きされる）
        set(newPostRef, msg);//"chat"にユニークKEYをつけてオブジェクトデータを登録

        $('#text2').val('');
    });


        //データ登録(Enter)
        // $(".text").on("keydown", function (e) {
        //     console.log(e);        //e変数の中身を確認！！
        //     if (e.keyCode == 13) {   //EnterKey=13
        //         const msg = {
        //             name: $(".name").val(),
        //             text: $(".text").val()
        //         }
        //         const newPostRef = push(dbRef);
        //         set(newPostRef, msg);
        //     }
        // });


        //最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
        onChildAdded(dbRef, function (data) {
            const msg = data.val();//オブジェクトデータを取得し、変数msgに代入
            console.log("New message added:", msg);
            const key = data.key;//データのユニークキー（削除や更新に必須）
            let html;
        //表示用テキスト・HTMLを作成
        if (data.val().value == 0) {
            html = `
            <div class="balloon_r ${key}">
                <div class="faceicon">
                    <img src="img/face1.jpg" alt="アイコン1" >
                </div>
                <div class="says">
                    <p>${msg.name}</p><br>
                    <p>${msg.text}</p>
                    <span class="remove" data-key="${key}">🗑</span>
                </div>
            </div>
            `
        } else {
            html = `
            <div class="balloon_l ${key}">
                <div class="faceicon">
                    <img src="img/face2.jpg" alt="アイコン2" >
                </div>
                <div class="says">
                    <p>${msg.name}</p><br>
                    <p>${msg.text}</p>
                    <span class="remove" data-key="${key}">🗑</span>
                </div>
            </div>
            `
        }
        $("#output").append(html); //#outputの最後に追加
        window.scroll(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
        });


        // 個別のチャットの削除
        $('#output').on('click', '.remove', function(){
            const key = $(this).attr('data-key');
            const removeItem = ref(db, 'chat/'+uid+'/'+key);
            remove(removeItem);// Firebaseデータ削除関数
        });

        onChildRemoved(dbRef, function(data) {
            $('.'+data.key).remove();// 対象を削除
        });


        // 全てのチャットの削除
        $('#deleteAll').on('click', function(){
            const removeItem = ref(db, 'chat');
            remove(removeItem);
        });

        onChildRemoved(dbRef, function(data){
            $('.'+data.key).remove();// 対象を削除
        });

        // Logout処理
        $('#logout').on('click', function() {
            signOut(auth).then(() => {
                // signoutがうまく行ったら
                _redirect();
            }).catch((error) => {
                // エラーが起きたら
                console.error(error);
            });
        });
    } else {
        _redirect();
    }
});

// Login画面へリダイレクトさせる関数
function _redirect() {
    location.href= 'login.html';    
}