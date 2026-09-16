// ====================
// 共通フッターを読み込む
// ====================

fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });


// ====================
// Google Analytics
// ====================

(function () {
    const measurementId = "G-XXXXXXXXXX";

    if (!measurementId || measurementId.includes("X")) {
        return;
    }

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    window.gtag = gtag;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    gtag("js", new Date());
    gtag("config", measurementId, {
        anonymize_ip: true,
        send_page_view: true
    });
})();


// ====================
// お知らせカテゴリー
// ====================

const tabs = document.querySelectorAll(".news-tab");
const newsItems = document.querySelectorAll(".news-item");


tabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const category = tab.dataset.category;


        // activeを変更
        tabs.forEach(function (tab) {
            tab.classList.remove("active");
        });

        tab.classList.add("active");


        // お知らせを絞り込む
        newsItems.forEach(function (item) {

            if (category === "all") {

                item.style.display = "flex";

            } else if (item.dataset.category === category) {

                item.style.display = "flex";

            } else {

                item.style.display = "none";
            }
        });
    });
});

// ==================================================
// サイト内検索
// ==================================================

// ====================
// キーワードを強調する
// ====================

function highlightText(text, keywords) {

    let result = text;

    keywords.forEach(function (word) {

        if (word === "") {
            return;
        }

        const escapedWord =
            word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const regex =
            new RegExp(`(${escapedWord})`, "gi");

        result = result.replace(
            regex,
            "<mark>$1</mark>"
        );

    });

    return result;
}


// ====================
// 検索を実行する
// ====================
function getSearchResults(keyword, category) {

    const keywords = keyword
        .trim()
        .toLowerCase()
        .split(/[\s　]+/);


    const matchedResults = searchData

        // スコアを計算
        .map(function (item) {

            let score = 0;

            const title =
                item.title.toLowerCase();

            const itemCategory =
                item.category.toLowerCase();

            const text =
                item.text.toLowerCase();


            keywords.forEach(function (word) {

                // タイトル
                if (title.includes(word)) {
                    score += 10;
                }

                // カテゴリー
                if (itemCategory.includes(word)) {
                    score += 5;
                }

                // 本文
                if (text.includes(word)) {
                    score += 1;
                }

            });


            return {
                ...item,
                score: score
            };

        })


        // 検索に一致しないものを除外
        .filter(function (item) {

            if (item.score === 0) {
                return false;
            }


            // 「すべて」
            if (category === "all") {
                return true;
            }


            // 指定されたカテゴリーだけ
            return item.category === category;

        })


        // 関連度の高い順
        .sort(function (a, b) {

            return b.score - a.score;

        });


    return {
        results: matchedResults,
        keywords: keywords
    };

}


// ====================
// 検索結果を表示する
// ====================
function displaySearchResults(results, keywords) {

    const resultsArea =
        document.getElementById("search-results");

    resultsArea.innerHTML = "";


    // 結果がない場合
    if (results.length === 0) {

        resultsArea.innerHTML = `
            <div class="no-result">
                <p>該当するページがありませんでした。</p>
                <p>別のキーワードで検索してください。</p>
            </div>
        `;

        return;
    }


    // 結果を1件ずつ表示
    results.forEach(function (item) {

        const result =
            document.createElement("article");

        result.className = "search-result";


        // キーワードを強調
        const highlightedTitle =
            highlightText(item.title, keywords);

        const highlightedText =
            highlightText(item.text, keywords);


        // 日付
        let dateHTML = "";

        if (item.date) {

            dateHTML = `
                <p class="search-date">
                    ${item.date}
                </p>
            `;

        }


        // 結果のHTML
        result.innerHTML = `

            <p class="search-category">
                ${item.category}
            </p>

            <h2>
                <a href="${item.url}">
                    ${highlightedTitle}
                </a>
            </h2>

            ${dateHTML}

            <p class="search-text">
                ${highlightedText}
            </p>

        `;


        resultsArea.appendChild(result);

    });

}


// ====================
// 検索ページ
// ====================
function searchSite() {

    const message =
        document.getElementById("search-message");

    const results =
        document.getElementById("search-results");


    // 検索ページ以外なら終了
    if (!message || !results) {
        return;
    }


    // URLから検索ワードを取得
    const params =
        new URLSearchParams(location.search);

    const keyword =
        params.get("q");


    // 検索ワードがない場合
    if (!keyword) {

        message.textContent =
            "検索キーワードを入力してください。";

        return;

    }


    // 検索実行
    const searchResult =
        getSearchResults(keyword, "all");


    // 件数表示
    message.textContent =
        `「${keyword}」の検索結果：${searchResult.results.length}件`;


    // 結果表示
    displaySearchResults(
        searchResult.results,
        searchResult.keywords
    );

}


// ====================
// カテゴリー絞り込み
// ====================

const filterButtons =
    document.querySelectorAll(".search-filter-button");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // 選択されたカテゴリー
        const category =
            button.dataset.category;


        // activeを変更
        filterButtons.forEach(function (button) {

            button.classList.remove("active");

        });

        button.classList.add("active");


        // URLから検索ワードを取得
        const params =
            new URLSearchParams(location.search);

        const keyword =
            params.get("q");


        if (!keyword) {
            return;
        }


        // 検索
        const searchResult =
            getSearchResults(keyword, category);


        // 件数表示
        const message =
            document.getElementById("search-message");

        message.textContent =
            `「${keyword}」の検索結果：${searchResult.results.length}件`;


        // 結果表示
        displaySearchResults(
            searchResult.results,
            searchResult.keywords
        );

    });

});


// ====================
// ブログを読み込む
// ====================

const blogsPerPage = 6;
let currentPage = 1;
function loadBlogs() {

    const blogList =
        document.getElementById("blog-list");

    if (!blogList) {
        return;
    }

    fetch("blog-data.json")
        .then(response => response.json())
        .then(blogs => {

            // blog番号の大きい順に並べる
            blogs.sort(function (a, b) {

                const numA =
                    parseInt(a.id.replace("blog", ""));

                const numB =
                    parseInt(b.id.replace("blog", ""));

                return numB - numA;

            });

            displayBlogs(blogs);

        });

}

loadBlogs();
function displayBlogs(blogs) {

    const blogList =
        document.getElementById("blog-list");

    blogList.innerHTML = "";

    const start =
        (currentPage - 1) * blogsPerPage;

    const end =
        start + blogsPerPage;

    const pageBlogs =
        blogs.slice(start, end);


    pageBlogs.forEach(function (blog) {

        const article =
            document.createElement("article");

        article.className = "blog-card";
        article.id = blog.id;

        article.innerHTML = `
    <img
        src="${blog.image}"
        alt="${blog.title}"
        class="blog-image"
        loading="lazy"
        decoding="async">

    <div class="blog-body">

        <p class="blog-date">
            ${blog.date}
        </p>

        <h2 class="blog-title">
            ${blog.title}
        </h2>

        <p class="blog-summary">
            ${blog.summary}
        </p>
        <p class="read-more">

        タップして続きを読む →

        </p>

    </div>
`;

        article.addEventListener("click", function () {

            openBlog(blog);

        });
        blogList.appendChild(article);

    });
    
    
    const modal =
        document.getElementById("blog-modal");
 
    const closeButton = 
        document.querySelector(".close-modal")
        closeButton.addEventListener("click", function () {
            modal.classList.remove("show");

        });
    modal.addEventListener("click", function (event) {

        // 背景だけをクリックした場合
        if (event.target === modal) {

            modal.classList.remove("show");

        }

    });
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            modal.classList.remove("show");

        }

    });

    createPagination(blogs);

}
function openBlog(blog) {

    const modal =
        document.getElementById("blog-modal");

    const body =
        document.getElementById("modal-body");

    body.innerHTML = `

        <p class="blog-date">

            ${blog.date}

        </p>

        <h1>

            ${blog.title}

        </h1>

        <img
            src="${blog.image}"
            alt="${blog.title}"
            class="modal-image"
            loading="lazy"
            decoding="async">

        <div class="modal-text">

            ${blog.text}

        </div>

    `;

    modal.classList.add("show");

}

function createPagination(blogs) {

    const pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    const pageCount =
        Math.ceil(blogs.length / blogsPerPage);

    // 前へ
    if (currentPage > 1) {

        const prev =
            document.createElement("button");

        prev.textContent = "＜";

        prev.onclick = function () {

            currentPage--;

            displayBlogs(blogs);

        };

        pagination.appendChild(prev);

    }

    // ページ番号
    for (let i = 1; i <= pageCount; i++) {

        const button =
            document.createElement("button");

        button.textContent = i;

        if (i === currentPage) {

            button.classList.add("active");

        }

        button.onclick = function () {

            currentPage = i;

            displayBlogs(blogs);

        };

        pagination.appendChild(button);

    }

    // 次へ
    if (currentPage < pageCount) {

        const next =
            document.createElement("button");

        next.textContent = "＞";

        next.onclick = function () {

            currentPage++;

            displayBlogs(blogs);

        };

        pagination.appendChild(next);

    }

}

// ====================
// イベント・ブログのお知らせを日付順に並べる
// ====================
function loadNews() {

    const newsList =
        document.getElementById("news-list");

    if (!newsList) {
        return;
    }

    // まず現在HTMLにあるイベントを取得
    const eventItems =
        Array.from(
            newsList.querySelectorAll(".news-item")
        );

    // ブログを読み込む
    fetch("blog-data.json")
        .then(response => response.json())
        .then(blogs => {

            // blog番号の大きい順
            blogs.sort(function (a, b) {

                const numA =
                    parseInt(a.id.replace("blog", ""));

                const numB =
                    parseInt(b.id.replace("blog", ""));

                return numB - numA;

            });

            // 最新ブログ1件だけ取得
            const latestBlog = blogs[0];

            if (latestBlog) {

                const article =
                    document.createElement("article");

                article.className = "news-item";
                article.dataset.category = "blog";

                const date =
                    latestBlog.date
                        .replace("年", "-")
                        .replace("月", "-")
                        .replace("日", "");

                article.innerHTML = `
                    <time datetime="${date}">
                        ${date.replace(/-/g, ".")}
                    </time>

                    <span class="news-category">
                        ブログ
                    </span>

                    <a href="blog.html">
                        活動ブログ「${latestBlog.title}」を更新しました
                    </a>
                `;

                newsList.appendChild(article);

            }

            // ====================
            // 日付の新しい順に並べ替える
            // ====================

            const allItems =
                Array.from(
                    newsList.querySelectorAll(".news-item")
                );

            allItems.sort(function (a, b) {

                const dateA =
                    new Date(
                        a.querySelector("time").dateTime
                    );

                const dateB =
                    new Date(
                        b.querySelector("time").dateTime
                    );

                return dateB - dateA;

            });

            // 並び順を反映
            allItems.forEach(function (item) {

                newsList.appendChild(item);

            });

        });

}

loadNews();

// ====================
// 共通ヘッダーを読み込む
// ====================

fetch("components/header.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("header").innerHTML = data;


        // ====================
        // スマホメニュー
        // ====================

        const menuButton =
            document.querySelector(".menu-button");

        const mobileMenu =
            document.querySelector(".mobile-menu");


        if (menuButton && mobileMenu) {

            // ハンバーガーボタン
            menuButton.addEventListener("click", function () {

                mobileMenu.classList.toggle("open");

            });


            // メニュー内のリンクを押したら閉じる
            const mobileLinks =
                mobileMenu.querySelectorAll("a");

            mobileLinks.forEach(function (link) {

                link.addEventListener("click", function () {

                    mobileMenu.classList.remove("open");

                });

            });

        }

    });





//----------------
const scheduleList =
    document.getElementById("schedule-list");

if (scheduleList) {

    fetch("schedule-data.json")
        .then(response => response.json())
        .then(data => {

            data.forEach(item => {

                scheduleList.innerHTML += `
                    <div class="schedule-item">

                        <div class="schedule-date">
                            <span>${item.year}</span>
                            ${item.date}
                        </div>

                        <div class="schedule-content">

                            <span class="schedule-category">
                                ${item.category}
                            </span>

                            <h3>${item.title}</h3>

                            <p>${item.description}</p>

                            <p class="schedule-place">
                                📍 ${item.place}
                            </p>

                        </div>

                    </div>
                `;
            });

        });

}
// ====================
// スクロール位置でメニューを切り替え
// ====================

const sections = document.querySelectorAll(".activity-section");
const menuLinks = document.querySelectorAll(".activity-menu nav a");

window.addEventListener("scroll", function () {

    let current = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 170;

        if (window.scrollY >= sectionTop) {
            current = section.id;
        }

    });

    menuLinks.forEach(function (link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");

            // スマホ版だけ、現在のタブを横方向に見える位置へ移動
            link.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        }

    });

});

// =====================
// スライドショー
// =====================

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");
const pauseButton = document.querySelector(".pause-button");


// スライドショーがあるページだけ実行
if (slides.length > 0 &&
    nextButton &&
    prevButton &&
    pauseButton) {

    let current = 0;
    let playing = true;
    let timer = setInterval(nextSlide, 5000);


    function showSlide(index) {

        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });

        dots.forEach(function (dot) {
            dot.classList.remove("active");
        });

        slides[index].classList.add("active");

        if (dots[index]) {
            dots[index].classList.add("active");
        }

    }


    function nextSlide() {

        current++;

        if (current >= slides.length) {
            current = 0;
        }

        showSlide(current);

    }


    function prevSlide() {

        current--;

        if (current < 0) {
            current = slides.length - 1;
        }

        showSlide(current);

    }


    function restartTimer() {

        clearInterval(timer);

        if (playing) {
            timer = setInterval(nextSlide, 5000);
        }

    }


    nextButton.addEventListener("click", function () {

        nextSlide();
        restartTimer();

    });


    prevButton.addEventListener("click", function () {

        prevSlide();
        restartTimer();

    });


    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            current = index;

            showSlide(current);

            restartTimer();

        });

    });


    pauseButton.addEventListener("click", function () {

        if (playing) {

            clearInterval(timer);

            playing = false;

            pauseButton.textContent = "▶";

        } else {

            playing = true;

            timer = setInterval(nextSlide, 5000);

            pauseButton.textContent = "❚❚";

        }

    });

}
// スマホメニューのリンクをクリックしたらメニューを閉じる
const mobileMenu = document.querySelector(".mobile-menu");

if (mobileMenu) {

    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileMenu.classList.remove("open");

        });

    });

}

//---------------------------------------------------------------------------編集----------
// 2枚目をクリックすると体験会ページへ

if (slides.length > 1) {

    slides[1].style.cursor = "pointer";

    slides[1].addEventListener("click", function () {
        window.location.href = "trial.html";
    });

}

document
    .querySelectorAll(".slide:first-child")
    .forEach(function (slide) {

        slide.style.cursor = "pointer";

        slide.addEventListener("click", function () {

            window.location.href = "trial.html";

        });

    });
//----------------------------------------------------------------------------------------
// ====================
// ニュースのカテゴリ切り替え
// ====================

document.addEventListener("click", function (event) {

    const tab =
        event.target.closest(".news-tab");

    if (!tab) {
        return;
    }

    const category =
        tab.dataset.category;

    const newsItems =
        document.querySelectorAll(".news-item");

    // タブの選択状態
    document
        .querySelectorAll(".news-tab")
        .forEach(function (item) {

            item.classList.remove("active");

        });

    tab.classList.add("active");

    // ニュースを分類
    newsItems.forEach(function (item) {

        const itemCategory =
            item.dataset.category;

        if (
            category === "all" ||
            itemCategory === category
        ) {

            item.style.display = "";

        }
        else {

            item.style.display = "none";

        }

    });

});


// ====================
// ホームページ内の活動予定へ移動
// ====================

document.addEventListener("click", function (event) {

    const link =
        event.target.closest('a[href="index.html#schedule"]');

    if (!link) {
        return;
    }

    const targetURL =
        new URL(link.href, window.location.href);

    const currentPath =
        window.location.pathname.replace(/\/$/, "") || "/index.html";

    const targetPath =
        targetURL.pathname.replace(/\/$/, "") || "/index.html";

    // 別ページへの遷移はブラウザ標準の動作に任せる
    if (
        currentPath !== targetPath ||
        targetURL.hash !== "#schedule"
    ) {
        return;
    }

    const schedule =
        document.getElementById("schedule");

    // index.html上にいる場合
    if (schedule) {

        // ブラウザ標準のジャンプを止める
        event.preventDefault();

        const header =
            document.querySelector(".header");

        const headerHeight =
            header ? header.offsetHeight : 0;

        // ★同じページからの場合の調整値
        const adjustment = -60;

        const position =
            schedule.getBoundingClientRect().top
            + window.scrollY
            - headerHeight
            - adjustment;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });

        history.pushState(
            null,
            "",
            "index.html#schedule"
        );

    }

});

// ====================
// 別ページからホームの活動予定へ来た場合
// ====================

window.addEventListener("load", function () {

    if (location.hash !== "#schedule") {
        return;
    }

    const schedule =
        document.getElementById("schedule");

    if (!schedule) {
        return;
    }

    const currentURL =
        new URL(location.href);

    if (!currentURL.pathname.endsWith("/index.html") &&
        currentURL.pathname !== "/") {
        return;
    }

    setTimeout(function () {

        const header =
            document.querySelector(".header");

        const headerHeight =
            header ? header.offsetHeight : 0;

        // ★他ページからの場合は60px下げる
        const adjustment = -60;

        const position =
            schedule.getBoundingClientRect().top
            + window.scrollY
            - headerHeight
            - adjustment;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });

    }, 500);

});