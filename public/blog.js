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

    const { date, title, image, text } = card.dataset;
    body.innerHTML = `
        <p class="blog-date">${date}</p>
        <h1>${title}</h1>
        <img src="${image}" alt="${title}" class="modal-image" loading="lazy" decoding="async">
        <div class="modal-text">${text}</div>
    `;
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
