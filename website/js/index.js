// Retrives of HTML DOM elements
const inputField = document.querySelector("#searchBar")
 form = document.querySelector("form")
 errorContainer = document.querySelector("#error")
 userErrorTag = document.querySelector("#userError")
 repoErrorTag = document.querySelector("#repoError")
 historySearches = document.querySelector("#historySearches")

let _history, _autoCompleteSearches = [];
let _autoCompleteJS;

window.onload = () => {
    //Gets history from localStorage if exists.
    if (localStorage.getItem("history")) {
        history = JSON.parse(localStorage.getItem("history"));
        history.forEach(item => {
            let ul = document.createElement("ul");
            let a = document.createElement("a");
            a.textContent = item;
            a.className = "historyItem"
            a.addEventListener("click", historySearch)
            ul.appendChild(a);
            historySearches.appendChild(ul);
        });
    }
    _autoCompleteSearches = history
    initAutocomplete()
};

/**
 * event listener that runs on input and updates autocomplete
 */
inputField.addEventListener("input", async (event) => {
    if (inputField.value.length % 3 === 0) {
        let search = await searchUser(inputField.value);
        _autoCompleteSearches = history;
        search.forEach(searchItem => {
            if (!_autoCompleteSearches.includes(searchItem.login)) _autoCompleteSearches.push(searchItem.login)
        });
        initAutocomplete();
    }
})

/**
 * event listener for on submit on form
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    search(inputField.value)
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
            let repo = await getRepo(value);
            if (repo) { //Checks if valid repo else displays error
                clearError();
                saveToHistory(value)
                window.location = `repo.html?repo=${value}`
            } else {
                repoError();
            }
        } else {
            let user = await getUser(value);
            if (user) { //Checks if valid user else displays error
                clearError();
                saveToHistory(value)
                window.location = `user.html?user=${value}`
            } else {
                userError();
            }
        }


    }
}

/**
 * @param  {string} value String to save to history in localstorage
 * 
 * Saves the input to localstorage and history
 */
saveToHistory = (value) => {
    //Saves search to localStorage for history
    if (!history.includes(value)) {
        history.push(value);
        if (history.length > 50) history.shift();
    }
    localStorage.setItem("history", JSON.stringify(history));
}

/**
 * Searches in history
 */
historySearch = (input) => {
    search(input.target.textContent)
}

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
            src: _autoCompleteSearches
        },
        resultItem: {
            highlight: {
                render: true
            }
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    _autoCompleteJS.input.value = selection;
                }
            }
        }
    });
    inputField.focus();
}