myApp.controller = {
    // Tabbarページコントローラー
    tabbarPage: function(page) {
        //Splitterのサイドバー表示
        page.querySelector('[component="button/menu"]').onclick = function() {
            document.querySelector("#mySplitter").left.toggle();
        }
    }
}
