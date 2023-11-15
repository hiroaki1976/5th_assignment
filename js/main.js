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


//データ登録send1(Click)
$(".inputarea1").on('click', '#send1', function () {
    const value = $(this).attr('value');
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
$(".inputarea2").on('click', '#send2', function () {
    const value = $(this).attr('value');
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
    console.log(html);
    $("#output").append(html); //#outputの最後に追加
    window.scroll(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
});


// 個別のチャットの削除
$('#output').on('click', '.remove', function(){
    const key = $(this).attr('data-key');
    const removeItem = ref(db, 'chat/'+key);
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

// 画面下部へスクロール