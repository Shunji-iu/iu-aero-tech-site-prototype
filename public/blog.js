// ブログページ
const blogsPerPage = 6;
let currentPage = 1;
const blogCards = Array.from(document.querySelectorAll(".blog-card"));

function openBlog(card) {
    const modal = document.getElementById("blog-modal");
    const body = document.getElementById("modal-body");
    if (!modal || !body) {
        return;
    }

    const content = document.getElementById(`blog-content-${card.id}`);
    const title = card.querySelector(".blog-title")?.textContent;
    const date = card.querySelector(".blog-date")?.textContent;
    const image = card.querySelector(".blog-image");
    if (!content || !title || !date || !(image instanceof HTMLImageElement)) {
        throw new Error(`ブログ記事の表示データが不足しています: ${card.id}`);
    }

    const heading = document.createElement("h1");
    heading.textContent = title;
    const dateElement = document.createElement("p");
    dateElement.className = "blog-date";
    dateElement.textContent = date;
    const modalImage = image.cloneNode();
    modalImage.className = "modal-image";

    body.replaceChildren(dateElement, heading, modalImage, content.content.cloneNode(true));
    modal.classList.add("show");
}

function createPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) {
        return;
    }

    pagination.innerHTML = "";
    const pageCount = Math.ceil(blogCards.length / blogsPerPage);

    if (currentPage > 1) {
        const previous = document.createElement("button");
        previous.textContent = "＜";
        previous.onclick = function () {
            currentPage--;
            displayBlogs();
        };
        pagination.appendChild(previous);
    }

    for (let page = 1; page <= pageCount; page++) {
        const button = document.createElement("button");
        button.textContent = page;
        button.classList.toggle("active", page === currentPage);
        button.onclick = function () {
            currentPage = page;
            displayBlogs();
        };
        pagination.appendChild(button);
    }

    if (currentPage < pageCount) {
        const next = document.createElement("button");
        next.textContent = "＞";
        next.onclick = function () {
            currentPage++;
            displayBlogs();
        };
        pagination.appendChild(next);
    }
}

function displayBlogs() {
    const start = (currentPage - 1) * blogsPerPage;
    blogCards.forEach(function (card, index) {
        card.style.display = index >= start && index < start + blogsPerPage ? "" : "none";
    });
    createPagination();
}

blogCards.forEach(card => card.addEventListener("click", () => openBlog(card)));

const blogModal = document.getElementById("blog-modal");
const closeModal = document.querySelector(".close-modal");
if (blogModal && closeModal) {
    closeModal.addEventListener("click", () => blogModal.classList.remove("show"));
    blogModal.addEventListener("click", function (event) {
        if (event.target === blogModal) {
            blogModal.classList.remove("show");
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            blogModal.classList.remove("show");
        }
    });
}

displayBlogs();
