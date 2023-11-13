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

//データ登録(Click)
$("#send").on("click", function () {
    const msg = {
        name: $("#name").val(),
        text: $("#text").val()
    }
    const newPostRef = push(dbRef); //ユニークKEYを生成
    set(newPostRef, msg);           //"chat"にユニークKEYをつけてオブジェクトデータを登録
});

//データ登録(Enter)
$("#text").on("keydown", function (e) {
    console.log(e);        //e変数の中身を確認！！
    if (e.keyCode == 13) {   //EnterKey=13
        const msg = {
            name: $("#name").val(),
            text: $("#text").val()
        }
        const newPostRef = push(dbRef); //ユニークKEYを生成
        set(newPostRef, msg);           //"chat"にユニークKEYをつけてオブジェクトデータを登録
    }
});

//最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
onChildAdded(dbRef, function (data) {
    const msg = data.val();    //オブジェクトデータを取得し、変数msgに代入
    const key = data.key;      //データのユニークキー（削除や更新に使用可能）
    //表示用テキスト・HTMLを作成
    let h = '<p>';
    h += msg.name;
    h += '<br>';
    h += msg.text;
    h += '</p>';
    $("#output").append(h); //#outputの最後に追加
});

// $('.inputarea').on('click', '#send', function () {
//     const iaItem = $(this).closest("div"); // クリックされたボタンに最も近い親 <li> 要素を取得
//     const name = iaItem.find('input').text();
//     const text = iaItem.find('textarea').text();
//     name = $('#name').val();
//     text = $('#text').val();