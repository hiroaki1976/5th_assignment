// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, update, onChildChanged }
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
    const newPostRef = push(dbRef);//ユニークKEYを生成（これをつけないとデータが上書きされる）
    set(newPostRef, msg);//"chat"にユニークKEYをつけてオブジェクトデータを登録
});


//データ登録(Enter)
$("#text").on("keydown", function (e) {
    console.log(e);        //e変数の中身を確認！！
    if (e.keyCode == 13) {   //EnterKey=13
        const msg = {
            name: $("#name").val(),
            text: $("#text").val()
        }
        const newPostRef = push(dbRef);
        set(newPostRef, msg);
    }
});


//最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
onChildAdded(dbRef, function (data) {
    const msg = data.val();//オブジェクトデータを取得し、変数msgに代入
    const key = data.key;//データのユニークキー（削除や更新に必須）
    //表示用テキスト・HTMLを作成
    let html = `
        <div class="balloon_r ${key}">
            <div class="faceicon">
                <img src="#.jpg" alt="" >
            </div>
            <div class="says">
                <p>${msg.name}</p><br>
                <p>${msg.text}</p>
                <span class="remove" data-key="${key}">🗑</span>
            </div>
        </div>
    `
    $("#output").append(html); //#outputの最後に追加
});


// 個別のチャットの削除
$('#output').on('click', '.remove', function (){
    const key = $(this).attr('data-key');
    const removeItem = ref(db, 'chat/'+key);
    remove(removeItem);// Firebaseデータ削除関数
});

onChildRemoved(dbRef, function(data) {
    $('.'+data.key).remove();// 対象を削除
});