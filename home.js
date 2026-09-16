// ホームのお知らせ
const newsTabs = document.querySelectorAll(".news-tab");

function filterNews(category) {
    document.querySelectorAll(".news-tab").forEach(function (tab) {
        tab.classList.toggle("active", tab.dataset.category === category);
    });

    document.querySelectorAll(".news-item").forEach(function (item) {
        item.style.display = category === "all" || item.dataset.category === category
            ? ""
            : "none";
    });
}

newsTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        filterNews(tab.dataset.category);
    });
});

function loadNews() {
    const newsList = document.getElementById("news-list");
    if (!newsList) {
        return;
    }

    fetch("blog-data.json")
        .then(response => response.json())
        .then(blogs => {
            blogs.sort(function (a, b) {
                return parseInt(b.id.replace("blog", ""))
                    - parseInt(a.id.replace("blog", ""));
            });

            const latestBlog = blogs[0];
            if (latestBlog) {
                const article = document.createElement("article");
                article.className = "news-item";
                article.dataset.category = "blog";

                const date = latestBlog.date
                    .replace("年", "-")
                    .replace("月", "-")
                    .replace("日", "");

                article.innerHTML = `
                    <time datetime="${date}">${date.replace(/-/g, ".")}</time>
                    <span class="news-category">ブログ</span>
                    <a href="blog.html">活動ブログ「${latestBlog.title}」を更新しました</a>
                `;
                newsList.appendChild(article);
            }

            const items = Array.from(newsList.querySelectorAll(".news-item"));
            items.sort(function (a, b) {
                return new Date(b.querySelector("time").dateTime)
                    - new Date(a.querySelector("time").dateTime);
            });
            items.forEach(item => newsList.appendChild(item));
        });
}

loadNews();

// スライドショー
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");
const pauseButton = document.querySelector(".pause-button");

if (slides.length && nextButton && prevButton && pauseButton) {
    let current = 0;
    let playing = true;
    let timer = setInterval(nextSlide, 5000);

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));
        slides[index].classList.add("active");
        if (dots[index]) {
            dots[index].classList.add("active");
        }
    }

    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    function prevSlide() {
        current = (current - 1 + slides.length) % slides.length;
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
        playing = !playing;
        pauseButton.textContent = playing ? "❚❚" : "▶";
        restartTimer();
    });

    if (slides[0]) {
        slides[0].style.cursor = "pointer";
        slides[0].addEventListener("click", () => {
            window.location.href = "trial.html";
        });
    }

    if (slides[1]) {
        slides[1].style.cursor = "pointer";
        slides[1].addEventListener("click", () => {
            window.location.href = "trial.html";
        });
    }
}
