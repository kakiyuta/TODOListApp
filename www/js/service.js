myApp.service = {
    // タスクサービス
    tasks: {
        // タスク作成
        create: function(data) {
            // HTMLエレメント作成
            var taskItem = ons.createElement(
                '<ons-list-item tappable category="' + myApp.service.categories.parseId(data.category) +'">' +
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
                myApp.service.animators.swipe(taskItem, function() {
                    var listId = (taskItem.parentElement.id === 'pending-list' && event.target.checked) ? '#complated-list' : '#pending-list';
                    console.log(listId);
                    document.querySelector(listId).appendChild(taskItem);
                });
            };
            taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

            // タスクをPending画面に追加
            var pendingList = document.querySelector('#pending-list');
            pendingList.insertBefore(taskItem, null);
        },
    },

    // カテゴリサービス
    categories: {
        // カテゴリ新規作成&カテゴリリストに登録
        create: function(categoryLabel) {

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
            urgent: false
        }
    ]

}
