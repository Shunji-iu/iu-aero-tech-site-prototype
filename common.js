// 共通ヘッダー・フッター
fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
        const footer = document.getElementById("footer");
        if (footer) {
            footer.innerHTML = data;
        }
    });

fetch("components/header.html")
    .then(response => response.text())
    .then(data => {
        const header = document.getElementById("header");
        if (!header) {
            return;
        }

        header.innerHTML = data;

        const menuButton = document.querySelector(".menu-button");
        const mobileMenu = document.querySelector(".mobile-menu");

        if (!menuButton || !mobileMenu) {
            return;
        }

        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("open");
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("open");
            });
        });
    });

// Google Analytics
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

// ホームの活動予定へのアンカー遷移
function scrollToSchedule() {
    const schedule = document.getElementById("schedule");
    if (!schedule) {
        return;
    }

    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 0;
    const adjustment = -60;
    const position = schedule.getBoundingClientRect().top
        + window.scrollY
        - headerHeight
        - adjustment;

    window.scrollTo({
        top: position,
        behavior: "smooth"
    });
}

document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href="index.html#schedule"]');
    if (!link) {
        return;
    }

    const targetURL = new URL(link.href, window.location.href);
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/index.html";
    const targetPath = targetURL.pathname.replace(/\/$/, "") || "/index.html";

    if (currentPath !== targetPath || targetURL.hash !== "#schedule") {
        return;
    }

    if (document.getElementById("schedule")) {
        event.preventDefault();
        scrollToSchedule();
        history.pushState(null, "", "index.html#schedule");
    }
});

window.addEventListener("load", function () {
    if (location.hash !== "#schedule" || !document.getElementById("schedule")) {
        return;
    }

    const currentURL = new URL(location.href);
    if (!currentURL.pathname.endsWith("/index.html") && currentURL.pathname !== "/") {
        return;
    }

    setTimeout(scrollToSchedule, 500);
});
