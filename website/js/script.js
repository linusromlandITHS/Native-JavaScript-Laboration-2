const inputField = document.querySelector("input");
const submitButton = document.querySelector("button");

submitButton.addEventListener("click", () => {
    const value = inputField.value;
    if (value.includes("/")) {
        console.log(`${value} is most likely a repo`);
    } else {
        console.log(`${value} is most likely a user`);
        searchUser(value);
    }
});