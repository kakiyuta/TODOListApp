myApp.services = {
    // タスクサービス
    tasks: {
        // タスク作成
        create: function(data) {
            // HTMLエレメント作成
            var taskItem = ons.createElement(
                '<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category) +'">' +
                    '<label class="left">' +
                        '<ons-checkbox></ons-checkbox>' +
                    '</label>' +
                    '<div class="center">' +
                        data.title +
                    '</div>' +
                    '<div class="right">' +
                        '<ons-icon style="color: grey;" size="24px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
                    '</div>' +
                '</ons-list-item>'
            );

            // エレメントにタスクデータを保存
            taskItem.data = data;

            // チェックイベント(Pendint ←→ Complated 切り替えイベント)
            taskItem.data.onCheckboxChange = function(event) {
                myApp.services.animators.swipe(taskItem, function() {
                    var listId = (taskItem.parentElement.id === 'pending-list' && event.target.checked) ? '#complated-list' : '#pending-list';
                    document.querySelector(listId).appendChild(taskItem);
                });
            };
            taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

            // タスク削除イベント
            taskItem.querySelector('.right').onclick = function() {
                myApp.services.tasks.remove(taskItem);
            }

            // タスクタップイベント
            taskItem.querySelector('.center').onclick = function() {
                document.querySelector('#myNavigator')
                .pushPage('details_task.html',
                {
                    animation: 'lift',
                    data: {
                        element: taskItem
                    }
                });
            };

            // カテゴリ追加処理
            myApp.services.categories.updateAdd(taskItem.data.category);

            // ハイライト処理
            if (taskItem.data.highlight) {
                taskItem.classList.add('highlight');
            }

            // タスクをPending画面に追加
            var pendingList = document.querySelector('#pending-list');
            pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
        },

        remove: function(taskItem) {
            // 登録されている変更イベント削除
            taskItem.removeEventListener('chane', taskItem.data.onCheckboxChange);

            myApp.services.animators.remove(taskItem, function(){
                // タスクを削除
                taskItem.remove();

                // 不要になってカテゴリを削除
                myApp.services.categories.updateRemove(taskItem.data.category);
            });
        },

        updata: function(taskItem, data) {

            if (data.title !== taskItem.data.title) {
                // タイトル更新
                taskItem.querySelector('.center').innerHTML = data.title;
            }

            if (data.category !== taskItem.data.category) {
                // カテゴリ更新
                taskItem.setAttribute('category', myApp.services.categories.parseId(data.category));
                myApp.services.categories.updateAdd(data.category);
                myApp.services.categories.updateRemove(taskItem.data.category);
            }

            // ハイライト設定
            taskItem.classList[data.highlight ? 'add' : 'remove']('highlight');

            taskItem.data = data;
        }
    },

    // カテゴリサービス
    categories: {
        // カテゴリ新規作成&カテゴリリストに登録
        create: function(categoryLabel) {
            var categoryId = myApp.services.categories.parseId(categoryLabel);

            // カテゴリリストエレメント
            var categoryItem = ons.createElement(
                '<ons-list-item tappable category-id="' + categoryId + '">' +
                    '<div class="left">' +
                        '<ons-radio name="categoryGroup" input-id="radio-' + categoryId + '"></ons-radio>' +
                    '</div>' +
                    '<label class="center" for="radio-' + categoryId + '">' +
                        (categoryLabel || 'No category') +
                    '</label>' +
                '</ons-list-item>'
            );

            // カテゴリフィルター機能の実装
            myApp.services.categories.bindOnCheckboxChange(categoryItem);

            // 新規カテゴリをカスタムカテゴリーリストに追加
            document.querySelector('#custom-category-list').appendChild(categoryItem);
        },

        updateAdd: function(categoryLabel) {
            var categoryId = myApp.services.categories.parseId(categoryLabel);
            var categoryItem = document.querySelector('#menuPage ons-list-item[category-id="' + categoryId +'"]');

            // 新規カテゴリの場合
            if(!categoryItem) {
                myApp.services.categories.create(categoryLabel);
            }
        },

        // タスク削除/更新による不要になったカテゴリを削除
        updateRemove: function(categoryLabel) {
            var categoryId = myApp.services.categories.parseId(categoryLabel);
            var categoryItem = document.querySelector('tabbarPage ons-list-item[category="' + categoryId +'"]');

            if (!categoryItem)
             {
                myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
            }
        },

        // カテゴリリストからカテゴリを削除
        remove: function(categoryItem) {
            if (categoryItem) {
                // 変更イベントを削除
                categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
                categoryItem.remove();
            }
        },

        bindOnCheckboxChange: function(categoryItem) {
            var categoryId = categoryItem.getAttribute('category-id')
            var allItems = categoryId === null;

            categoryItem.updateCategoryView = function() {
                var query = '[category="' + (categoryId || '') + '"]';

                var taskItem = document.querySelectorAll('#tabbarPage ons-list-item');
                for (var i = 0; i < taskItem.length; i++) {
                    taskItem[i].style.display = (allItems || taskItem[i].getAttribute('category') === categoryId) ? '' : 'none';
                }
            };
            categoryItem.addEventListener('change', categoryItem.updateCategoryView);
        },

        // カテゴリ名をIDに変換
        parseId: function(categoryLabel) {
            return categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
        }
    },

    // アニメーションサービス
    animators: {
        // Swipe
        swipe: function(listItem, callback) {
            var animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
            listItem.classList.add('hide-children');
            listItem.classList.add(animation);

            setTimeout(function() {
                listItem.classList.remove(animation);
                listItem.classList.remove('hide-children');
                callback();
            }, 950);
        },

        // remove
        remove: function(listItem, callback) {
            listItem.classList.add('animation-remove');
            listItem.classList.add('hide-children');

            setTimeout(function() {
                callback();
            }, 750);
        }
    },

    // 初期表示用タスク
    initTasks : [
        {
            title: "Install Node.js",
            category: "Preparation",
            description: "Description Sentence",
            highlight: true,
            urgent: false
        },
        {
            title: "Install Cordova",
            category: "Preparation",
            description: "Description Sentence",
            highlight: true,
            urgent: false
        },
        {
            title: "Install Libraly Of OnsenUI",
            category: "Preparation",
            description: "Description Sentence",
            highlight: true,
            urgent: false
        },
        {
            title: "Git",
            category: "Preparation",
            description: "Description Sentence",
            highlight: true,
            urgent: false
        },
        {
            title: "Stady HTML",
            category: "",
            description: "Description Sentence",
            highlight: false,
            urgent: false
        },
        {
            title: "Stady Javascript",
            category: "Stady",
            description: "Description Sentence",
            highlight: false,
            urgent: false
        },
        {
            title: "Create MainWindow",
            category: "Programing",
            description: "Description Sentence",
            highlight: false,
            urgent: false
        },
        {
            title: "Create SideManu",
            category: "Programing",
            description: "Description Sentence",
            highlight: false,
            urgent: false
        },
        {
            title: "Create CreationNewTask",
            category: "Programing",
            description: "Description Sentence",
            highlight: false,
            urgent: false
        },
        {
            title: "Create TaskDetailInfomation",
            category: "Programing",
            description: "Description Sentence",
            highlight: false,
            urgent: false
        },
        {
            title: "Category Test",
            category: "foo bar HOGE",
            description: "",
            highlight: false,
            urgent: true
        }
    ]

}
