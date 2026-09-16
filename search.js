// サイト内検索
function highlightText(text, keywords) {
    let result = text;
    keywords.forEach(function (word) {
        if (!word) {
            return;
        }
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(new RegExp(`(${escapedWord})`, "gi"), "<mark>$1</mark>");
    });
    return result;
}

function getSearchResults(keyword, category) {
    const keywords = keyword.trim().toLowerCase().split(/[\s　]+/);
    const matchedResults = searchData
        .map(function (item) {
            let score = 0;
            const title = item.title.toLowerCase();
            const itemCategory = item.category.toLowerCase();
            const text = item.text.toLowerCase();
            keywords.forEach(function (word) {
                if (title.includes(word)) score += 10;
                if (itemCategory.includes(word)) score += 5;
                if (text.includes(word)) score += 1;
            });
            return { ...item, score };
        })
        .filter(item => item.score > 0 && (category === "all" || item.category === category))
        .sort((a, b) => b.score - a.score);

    return { results: matchedResults, keywords };
}

function displaySearchResults(results, keywords) {
    const resultsArea = document.getElementById("search-results");
    if (!resultsArea) {
        return;
    }

    resultsArea.innerHTML = "";
    if (!results.length) {
        resultsArea.innerHTML = `
            <div class="no-result">
                <p>該当するページがありませんでした。</p>
                <p>別のキーワードで検索してください。</p>
            </div>
        `;
        return;
    }

    results.forEach(function (item) {
        const result = document.createElement("article");
        result.className = "search-result";
        const dateHTML = item.date ? `<p class="search-date">${item.date}</p>` : "";
        result.innerHTML = `
            <p class="search-category">${item.category}</p>
            <h2><a href="${item.url}">${highlightText(item.title, keywords)}</a></h2>
            ${dateHTML}
            <p class="search-text">${highlightText(item.text, keywords)}</p>
        `;
        resultsArea.appendChild(result);
    });
}

function searchSite(category = "all") {
    const message = document.getElementById("search-message");
    const results = document.getElementById("search-results");
    if (!message || !results) {
        return;
    }

    const keyword = new URLSearchParams(location.search).get("q");
    if (!keyword) {
        message.textContent = "検索キーワードを入力してください。";
        return;
    }

    const searchResult = getSearchResults(keyword, category);
    message.textContent = `「${keyword}」の検索結果：${searchResult.results.length}件`;
    displaySearchResults(searchResult.results, searchResult.keywords);
}

document.querySelectorAll(".search-filter-button").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll(".search-filter-button").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        searchSite(button.dataset.category);
    });
});

searchSite();
