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

    //初期表示用タスクテンプレート表示
    if (page.id === 'pendingTaskPage') {
        // TODO : 初期表示以外は表示させないように条件を追加する必要がある
        myApp.services.initTasks.forEach(function(data) {
            myApp.services.tasks.create(data);
        });
    }
});
