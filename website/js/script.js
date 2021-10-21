const inputField = document.querySelector("#searchBar");
const form = document.querySelector("form");
const errorContainer = document.querySelector("#error");
const userErrorTag = document.querySelector("#userError");
const repoErrorTag = document.querySelector("#repoError");
let history = [];

window.onload = () => {
  //Gets history from localStorage if exists.
  if (localStorage.getItem("history"))
    history = JSON.parse(localStorage.getItem("history"));
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = inputField.value;
  if (value) {
    //Checks if input includes /. (is repo or not)
    if (value.includes("/")) {
      let repo = await getRepo(value);
      if (repo) { //Checks if valid repo else displays error
        clearError();
        console.log(repo);
      } else {
        repoError();
      }
    } else {
      let user = await getUser(value);
      if (user) { //Checks if valid user else displays error
        clearError();
        console.log(user);
      } else {
        userError();
      }
    }

    //Saves search to localStorage for history
    if (!history.includes(value)) {
      history.push(value);
      if (history.length > 5) history.shift();
    }
    localStorage.setItem("history", JSON.stringify(history));
  }
});

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
