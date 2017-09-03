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
    },

    // Menuバーコントローラー
    menuPage: function(page) {
        // カテゴリ"All", "No Category"のフィルター機能を実装
        myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
        myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));
    },

    //タスク詳細ページコントローラー
    detailsTaskPage: function(page) {
        // pushPageされたタスク情報を取得
        var element = page.data.element;

        // タスクの情報を画面に表示
        page.querySelector('#title-input').value = element.data.title;
        page.querySelector('#category-input').value = element.data.category;
        page.querySelector('#description-input').value = element.data.description;
        page.querySelector('#highlight-input').checked = element.data.highlight;
        page.querySelector('#urgent-input').checked = element.data.urgent;

        // Saveボタン押下イベント
        page.querySelector('[component="button/save-task"]').onclick = function() {
            var newTitle = page.querySelector('#title-input').value;

            if (newTitle) {
                //タスク更新確認ダイアログ
                ons.notification.confirm(
                    {
                        title: 'Save changes?',
                        message: 'Previous data will be oberwritten.',
                        buttonLabels: ['Discard', 'Save']
                    }
                ).then(function(buttonIndex) {
                    // Save選択時の処理
                    if (buttonIndex === 1) {
                        myApp.services.tasks.updata(element,
                            {
                                title: newTitle,
                                category: page.querySelector('#category-input').value,
                                description: page.querySelector('#description-input').value,
                                highlight: page.querySelector('#highlight-input').checked,
                                urgent: element.data.urgent
                            }
                        );

                        // フィルター設定をALLに変更
                        document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
                        // カテゴリ一覧を更新
                        document.querySelector('#default-category-list ons-list-item').updateCategoryView();
                        // ページを戻る
                        document.querySelector('#myNavigator').popPage();
                    }
                });
            } else {
                // error
                ons.notification.alert('You must provide a task title.');
            }
        };
    }
}
