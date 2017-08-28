myApp.controller = {
    // Tabbarページコントローラー
    tabbarPage: function(page) {
        //Splitterのサイドバー表示
        page.querySelector('[component="button/menu"]').onclick = function() {
            document.querySelector("#mySplitter").left.toggle();
        };

        // 新規タスク作成画面表示
        page.querySelector('[component="button/new-task"]').onclick = function() {
            document.querySelector("#myNavigator").pushPage('new_task.html');
        };
    }
}
