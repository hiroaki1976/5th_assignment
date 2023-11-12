// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
// Your web app's Firebase configuration
// 以下のfirebaseConfigは絶対githubにはアップロードしない！！
const firebaseConfig = {
    
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app); //RealtimeDBに接続
    const dbRef = ref(db, "chat"); //RealtimeDB内の"chat"を使う

// 変数の定義
let name1;
let name2;
let text1;
let text2;
let msg1;
let msg2;
let html;

// ↓左側の送信ボタンが押された時の動作
$('#send1').on('click', function () {
    name1 = $('#name1').val();
    text1 = $('#text1').val();

    console.log(name1, 'name1の文字');
    console.log(text1, 'text1の文字');

    $('#text1').val('');

    msg1 = {
        name1: name1,
        text1: text1,
    }
    // push,setはFirebaseの用意したコマンド（JavaScriptのメソッドとは違う！）
    const newPostRef = push(dbRef);
    set(newPostRef, msg1);
});
// ここまで↑

// ↓右側の送信ボタンが押された時の動作
$('#send2').on('click', function () {
    name2 = $('#name2').val();
    text2 = $('#text2').val();

    console.log(name2, 'name2の文字');
    console.log(text2, 'text2の文字');

    $('#text2').val('');

    msg2 = {
        name2: name2,
        text2: text2,
    }
    // push,setはFirebaseの用意したコマンド（JavaScriptのメソッドとは違う！）
    const newPostRef = push(dbRef);
    set(newPostRef, msg2);
});
// ここまで↑

//最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
onChildAdded(dbRef, function(data) {
    const key = data.key;

    if (msg1 != undefined) {
        msg1 = data.val();
        html = `
    <div class=${key}>
        <p>${msg1.name1}</p>
        <p>${msg1.text1}</p>
    </div>
        `
    } else if (msg2 != undefined) {
        msg2 = data.val();
        html = `
    <div class=${key}>
        <p>${msg2.name2}</p>
        <p>${msg2.text2}</p>
    </div>
    `
    }
    console.log(msg2);
    console.log(html);
    
    $('#output').append(html);
});