// ブログページ
const blogsPerPage = 6;
let currentPage = 1;
let blogs = [];

function openBlog(blog) {
    const modal = document.getElementById("blog-modal");
    const body = document.getElementById("modal-body");
    if (!modal || !body) {
        return;
    }

    body.innerHTML = `
        <p class="blog-date">${blog.date}</p>
        <h1>${blog.title}</h1>
        <img src="${blog.image}" alt="${blog.title}" class="modal-image" loading="lazy" decoding="async">
        <div class="modal-text">${blog.text}</div>
    `;
    modal.classList.add("show");
}

function createPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) {
        return;
    }

    pagination.innerHTML = "";
    const pageCount = Math.ceil(blogs.length / blogsPerPage);

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
    const blogList = document.getElementById("blog-list");
    if (!blogList) {
        return;
    }

    blogList.innerHTML = "";
    const start = (currentPage - 1) * blogsPerPage;
    blogs.slice(start, start + blogsPerPage).forEach(function (blog) {
        const article = document.createElement("article");
        article.className = "blog-card";
        article.id = blog.id;
        article.innerHTML = `
            <img src="${blog.image}" alt="${blog.title}" class="blog-image" loading="lazy" decoding="async">
            <div class="blog-body">
                <p class="blog-date">${blog.date}</p>
                <h2 class="blog-title">${blog.title}</h2>
                <p class="blog-summary">${blog.summary}</p>
                <p class="read-more">タップして続きを読む →</p>
            </div>
        `;
        article.addEventListener("click", () => openBlog(blog));
        blogList.appendChild(article);
    });
    createPagination();
}

function loadBlogs() {
    const blogList = document.getElementById("blog-list");
    if (!blogList) {
        return;
    }

    fetch("blog-data.json")
        .then(response => response.json())
        .then(data => {
            blogs = data.sort(function (a, b) {
                return parseInt(b.id.replace("blog", ""))
                    - parseInt(a.id.replace("blog", ""));
            });
            displayBlogs();
        });
}

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

loadBlogs();
