(function () {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");

    // If not visited before, set the theme to light mode
    if (!hasVisitedBefore) {
        localStorage.setItem("theme", "light");
        localStorage.setItem("hasVisitedBefore", true);
    }

    if (!window.location.pathname.includes("index.html")) return; // guard clause

    const apiKey = 'R6JswxR2AtoZ4AIEMyGPr0Z4oGATvNsL';

    // Function to fetch articles
    async function fetchArticles(endpoint, containerSelector, dropdownSelector, articleClass) {
        try {
            const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${endpoint}.json?api-key=${apiKey}`);
            const data = await response.json();

            if (response.ok) {
                const articles = data.results.slice(1, 6);
                const articleContent = articles.map((article, index) => `
                <a href="${article.url}" target="_blank" class="swipe-article" data-content="${article.title} - ${article.abstract} - ${article.multimedia[0].url}">
                    <div class="articleContainer">
                    <img src="${article.multimedia[0].url}" alt="Article Image" class="articleImage">
                    <div class="articleTexts">
                        <h3 class="articleHeader">${article.title}</h3>
                        <p class="articleText">${article.abstract}</p>
                    </div>
                    </div>
                </a>
            `).join('');

                document.querySelector(containerSelector).innerHTML = articleContent;

                // Add swipe event listeners to each article container
                const swipeArticles = document.querySelectorAll('.swipe-article');
                swipeArticles.forEach(article => {
                    let startX;

                    article.addEventListener('touchstart', (e) => {
                        startX = e.touches[0].clientX;
                    });

                    article.addEventListener('touchend', (e) => {
                        const distX = e.changedTouches[0].clientX - startX;

                        // Adjust the threshold based on your needs
                        if (distX < 50) {
                            // Swipe left, save to local storage
                            const articleIndex = article.getAttribute('data-content');
                            const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];

                            // Check if the article is not already in the saved list
                            if (!savedArticles.includes(articleIndex)) {
                                savedArticles.push(articleIndex);
                                localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
                                alert('Article saved to local storage!');
                            }
                        }
                    });
                });
            } else {
                console.error(`Error fetching articles for ${endpoint}: ${data.message}`);
                document.querySelector(containerSelector).innerText = 'Failed to fetch articles.';
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            document.querySelector(containerSelector).innerText = 'Failed to fetch articles.';
        }
    }

    // Fetch articles for Business
    fetchArticles('business', '.ArticleTextBusiness', '#businessDropdown', 'ArticleBusiness');

    // Fetch articles for Health
    fetchArticles('health', '.ArticleTextHealth', '#healthDropdown', 'ArticleHealth');

    // Fetch articles for Sports
    fetchArticles('sports', '.ArticleTextSport', '#sportDropdown', 'ArticleSport');

    // Fetch articles for Europe
    fetchArticles('world/europe', '.ArticleTextEurope', '#europeDropdown', 'ArticleEurope');

    // Fetch articles for Travel
    fetchArticles('travel', '.ArticleTextTravel', '#travelDropdown', 'ArticleTravel');

    function clickHandler(dropdownSelector, articleClass) {
        //const DROPDOWN = document.querySelector(dropdownSelector);
        const ARTICLE = document.querySelector(`.${articleClass}`);
        // Toggle visibility of the article
        ARTICLE.classList.toggle("hidden");

        // Toggle arrow icon based on the visibility of .newsArticle
        if (ARTICLE.classList.contains("hidden")) {
            //DROPDOWN.classList.remove("fa-chevron-down");
            //DROPDOWN.classList.add("fa-chevron-right");
        } else {
            //DROPDOWN.classList.remove("fa-chevron-right");
            //DROPDOWN.classList.add("fa-chevron-down");
        }
    }

    // Add click event listeners for each dropdown
    document.querySelector('#businessDropdown').addEventListener("click", () => clickHandler('#businessDropdown', 'ArticleBusiness'));
    document.querySelector('#healthDropdown').addEventListener("click", () => clickHandler('#healthDropdown', 'ArticleHealth'));
    document.querySelector('#sportDropdown').addEventListener("click", () => clickHandler('#sportDropdown', 'ArticleSport'));
    document.querySelector('#travelDropdown').addEventListener("click", () => clickHandler('#travelDropdown', 'ArticleTravel'));
    document.querySelector('#europeDropdown').addEventListener("click", () => clickHandler('#europeDropdown', 'ArticleEurope'));

    function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
        if (localStorageTheme !== null) {
            return localStorageTheme;
        }

        if (systemSettingDark.matches) {
            return "dark";
        }

        return "light";
    }

    function updateButton({ buttonEl, isDark }) {
        const newCta = isDark ? "TOGGLE DARK MODE" : "TOGGLE DARK MODE";
    }

    /**
    * Utility function to update the theme setting on the body tag
    */
    function updateThemeOnBody({ theme }) {
        document.querySelector("body").setAttribute("data-theme", theme);
    }

    const button = document.querySelector("[data-settings-theme-toggle]");
    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

    /**
    * 2. Work out the current site settings
    */
    let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

    /**
    * 3. Update the theme setting and button text accoridng to current settings
    */
    updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
    updateThemeOnBody({ theme: currentThemeSetting });


    function hideCategory() {
        var switchHealth = localStorage.getItem("switchHealth");

        if (switchHealth === "false") {
            document.querySelector("#healthArticle").style.display = "none";
        }

        var switchHealth = localStorage.getItem("switchTravel");

        if (switchHealth === "false") {
            document.querySelector("#travelArticle").style.display = "none";
        }

        var switchSport = localStorage.getItem("switchSport");

        if (switchSport === "false") {
            document.querySelector("#sportArticle").style.display = "none";
        }

        var switchEurope = localStorage.getItem("switchEurope");

        if (switchEurope === "false") {
            document.querySelector("#europeArticle").style.display = "none";
        }

        var switchBusiness = localStorage.getItem("switchBusiness");

        if (switchBusiness === "false") {
            document.querySelector("#businessArticle").style.display = "none";
        }

    }

    // Call the hideCategory function when the page loads
    document.addEventListener("DOMContentLoaded", hideCategory);
})();