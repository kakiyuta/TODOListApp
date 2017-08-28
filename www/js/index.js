// App logic.
window.myApp = {};

// 'init'はOnsenUIのページ<ons-page>が生成された直後に発生するイベント
document.addEventListener('init', function(event) {
    var page = event.target;

    //各ページの初期化処理をキック
    // controllerにpage.idに対応したメソッドがあるか確認
    if (myApp.controller.hasOwnProperty(page.id)) {
        myApp.controller[page.id](page);
    }
});
