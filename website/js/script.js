const inputField = document.querySelector("#searchBar");
const form = document.querySelector("form");
const errorContainer = document.querySelector("#error");
const userErrorTag = document.querySelector("#userError");
const repoErrorTag = document.querySelector("#repoError");
const historySearches = document.querySelector("#historySearches");
let history = [];
let autoCompleteSearches = [];
let autoCompleteJS;

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
    autoCompleteSearches = history
    initAutocomplete()
};

inputField.addEventListener("input", async (event) => {
    if (inputField.value.length % 3 === 0) {
        let search = await searchUser(inputField.value);
        autoCompleteSearches = history;
        search.forEach(searchItem => {
            if (!autoCompleteSearches.includes(searchItem.login)) autoCompleteSearches.push(searchItem.login)
        });
        initAutocomplete();
    }
})

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = inputField.value;
    search(value)
});

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

saveToHistory = (value) => {
    //Saves search to localStorage for history
    if (!history.includes(value)) {
        history.push(value);
        if (history.length > 50) history.shift();
    }
    localStorage.setItem("history", JSON.stringify(history));
}

historySearch = (input) => {
    search(input.target.textContent)
}

userError = () => {
    errorContainer.hidden = false;
    repoErrorTag.hidden = true;
    userErrorTag.hidden = false;
};

repoError = () => {
    errorContainer.hidden = false;
    repoErrorTag.hidden = false;
    userErrorTag.hidden = true;
};

clearError = () => {
    errorContainer.hidden = true;
    repoErrorTag.hidden = true;
    userErrorTag.hidden = true;
};

initAutocomplete = () => {
    autoCompleteJS = new autoComplete({
        selector: "#searchBar",
        placeHolder: "Search for Github Account/Repository...",
        submit: true,
        data: {
            src: autoCompleteSearches
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
                    autoCompleteJS.input.value = selection;
                }
            }
        }
    });
    inputField.focus();
}