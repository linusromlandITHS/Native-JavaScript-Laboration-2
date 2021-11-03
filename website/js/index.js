// Retrives of HTML DOM elements
const inputField = document.querySelector("#searchBar");
form = document.querySelector("form");
errorContainer = document.querySelector("#error");
userErrorTag = document.querySelector("#userError");
repoErrorTag = document.querySelector("#repoError");
historySearches = document.querySelector("#historySearches");

let _history = [];
let _autoCompleteSearches = [];
let _autoCompleteJS;

window.onload = () => {
    initPartials();

    //Gets history from localStorage if exists.
    if (localStorage.getItem("history")) {
        _history = JSON.parse(localStorage.getItem("history"));
        _history.forEach((item) => {
            const ul = document.createElement("ul");
            const a = document.createElement("a");
            a.textContent = item;
            a.className = "historyItem";
            a.addEventListener("click", historySearch);
            ul.appendChild(a);
            historySearches.appendChild(ul);
        });
    }
    if (_history && _history.length > 0) _autoCompleteSearches = _history;
    initAutocomplete();
};

/**
 * event listener that runs on input and updates autocomplete
 */
inputField.addEventListener("input", async (event) => {
    if (inputField.value.length % 3 === 0) {
        const search = await searchUser(inputField.value);
        if (_history && _history.length > 0) _autoCompleteSearches = _history;
        search.forEach((searchItem) => {
            if (!_autoCompleteSearches.includes(searchItem.login))
                _autoCompleteSearches.push(searchItem.login);
        });
        initAutocomplete();
    }
});

/**
 * event listener for on submit on form
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    search(inputField.value);
});

/**
 * @param  {string} value String to search for in
 *
 * Searches for input as user or repo depending on if / is in string
 */
search = async (value) => {
    if (value) {
        //Checks if input includes /. (is repo or not)
        if (value.includes("/")) {
            const repo = await getRepo(value);
            if (repo) {
                //Checks if valid repo else displays error
                clearError();
                saveToHistory(value);
                window.location = `repo.html?repo=${value}`;
            } else {
                repoError();
            }
        } else {
            const user = await getUser(value);
            if (user) {
                //Checks if valid user else displays error
                clearError();
                saveToHistory(value);
                window.location = `user.html?user=${value}`;
            } else {
                userError();
            }
        }
    }
};

/**
 * @param  {string} value String to save to history in localstorage
 *
 * Saves the input to localstorage and history
 */
saveToHistory = (value) => {
    if (_history) {
        //Saves search to localStorage for history
        if (!_history.includes(value)) {
            _history.push(value);
            if (_history.length > 50) _history.shift();
        }
    } else {
        _history.push(value);
    }

    localStorage.setItem("history", JSON.stringify(_history));
};

/**
 * Searches in history
 */
historySearch = (input) => {
    search(input.target.textContent);
};

/**
 * Displays user error
 */
userError = () => {
    errorContainer.hidden = false;
    repoErrorTag.hidden = true;
    userErrorTag.hidden = false;
};

/**
 * Displays repository error
 */
repoError = () => {
    errorContainer.hidden = false;
    repoErrorTag.hidden = false;
    userErrorTag.hidden = true;
};

/**
 * Clears all errors
 */
clearError = () => {
    errorContainer.hidden = true;
    repoErrorTag.hidden = true;
    userErrorTag.hidden = true;
};

/**
 * initialize of Autocomplete.JS
 */
initAutocomplete = () => {
    _autoCompleteJS = new autoComplete({
        selector: "#searchBar",
        placeHolder: "Search for Github Account/Repository...",
        submit: true,
        data: {
            src: _autoCompleteSearches,
        },
        resultItem: {
            highlight: {
                render: true,
            },
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    _autoCompleteJS.input.value = selection;
                },
            },
        },
    });
    inputField.focus();
};
