// ====================
// サイト内検索用データ
// ====================

let searchData = [

    // ====================
    // 固定ページ
    // ====================

    {
        title: "活動内容",
        category: "活動内容",
        text: "航空技術研究会では、飛行ロボットコンテスト、空撮プロジェクト、ドローン教室、水ロケット、RC飛行機などの活動を行っています。",
        url: "activity.html"
    },

    {
        title: "メンバー",
        category: "メンバー",
        text: "航空技術研究会の代表、副代表などのメンバーを紹介しています。",
        url: "member.html"
    },

    {
        title: "入会希望の方へ",
        category: "入会案内",
        text: "茨城大学のすべての学年・学部の学生を募集しています。航空技術、電子工作、プログラミング、ドローン、ロケットなどに興味のある方を歓迎します。",
        url: "join.html"
    },

    {
        title: "よくある質問",
        category: "FAQ",
        text: "見学はできますか。どの学年からでも参加できますか。活動についてのよくある質問を紹介しています。",
        url: "faq.html"
    },

    {
        title: "お問い合わせ",
        category: "お問い合わせ",
        text: "メール、X、Instagram、YouTubeからお問い合わせいただけます。",
        url: "contact.html"
    },

];
// ====================
// ブログを検索データに追加
// ====================

fetch("blog-data.json")
    .then(response => response.json())
    .then(blogs => {

        blogs.forEach(function (blog) {

            searchData.push({

                title: blog.title,

                category: "ブログ",

                date: blog.date,

                text: blog.text,

                url: `blog.html#${blog.id}`

            });

        });


        // ブログ追加後に検索を実行
        searchSite();

    });
