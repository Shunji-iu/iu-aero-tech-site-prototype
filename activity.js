// 活動内容ページのスクロールメニュー
const sections = document.querySelectorAll(".activity-section");
const menuLinks = document.querySelectorAll(".activity-menu nav a");

if (sections.length && menuLinks.length) {
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
                link.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
            }
        });
    });
}
