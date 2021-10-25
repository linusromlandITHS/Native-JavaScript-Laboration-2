// Retrives of HTML DOM elements
const nameTag = document.querySelector("#name")
usernameTag = document.querySelector("#username")
loadingArea = document.querySelector("#loadingArea")
main = document.querySelector("#main")
commitAmount = document.querySelector("#commitAmount")
topRepositories = document.querySelector("#topRepositories")
profilePicture = document.querySelector("#profilePicture")

let user, name;

window.onload = async () => {
    //Convert URL to Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    //Gets user from GitHub API
    let user = await getUser(params.user);
    //Redirects client if user not found
    if (!user) window.location = "index.html"


    let events = await getEvents(user.login)
    let chartData = await eventArrayToChart(events)
    await renderChart(chartData.amount, chartData.day, "#chart", "line", "Commits")

    displayName(user)
    displayTopRepos(chartData.topRepositories)
    displayCommitAmount(chartData)
    displayProfilePicture(user)

    let fakeloading = true;
    setTimeout(() => {
        fakeloading = false;
        loading(true)
    }, 1000)

    if (!fakeloading) loading(true)
}

/**
 * 
 * Shows the main content and hides loading display
 */
loading = () => {
    console.log("Loading complete!")
    main.hidden = false;
    loadingArea.style.display = "none"
}

/**
 * @param  {object} user Object containing the user information
 * 
 * Sets the username DOMs and updated metadata.
 */
displayName = (user) => {
    //Sets varible "name" to login or Username if exsits.
    name = user.name ? user.name : user.login;
    document.title = `${user.login} - Github Statistics`
    nameTag.textContent = name

    //If GitHub profile has name set, shows login name in other field.
    if (user.name) {
        usernameTag.textContent = user.login
        usernameTag.hidden = false;
    }

    document.querySelector('meta[name="description"]').setAttribute("content", `Github Statistics for user ${user.login}`);
}

/**
 * @param  {array} arr Object array of the top repositories
 * 
 * Loops through the top repositories (max 5) and displays them in the DOM.
 */
displayTopRepos = (arr) => {
    let amount = arr.length > 5 ? 5 : arr.length

    topRepositories.hidden = false;
    for (let i = 0; i < amount; i++) {
        const element = arr[i];
        let li = document.createElement("li");
        li.textContent = `Repo: ${element.repo} (Commits: ${element.amount})`
        topRepositories.appendChild(li)
    }
}

/**
 * @param  {object} data Object containing all commits (amount and day)
 * 
 * Adds all commmits to one number and displays in DOM.
 */
displayCommitAmount = (data) => {
    let commits = data.amount.length > 0;
    if (commits) {
        data.amount.forEach(amount => {
            commits += parseInt(amount)
        });
        commitAmount.textContent = `Commits (${data.day[0]} - ${data.day[data.day.length -1]}): ${commits}`
        commitAmount.hidden = false;
    }
}

/**
 * @param  {object} user Object containing the user information
 * 
 * Displays the profile picture of user in image DOM
 */
displayProfilePicture = (user) => {
    profilePicture.setAttribute('src', user.avatar_url)
}

/**
 * @param  {array} eventArray Array of Events directly from GitHub's API
 * 
 * Converts the eventArray from GitHub's API to a object with the amount of commits each day and the total number of commits in each repository.
 */
eventArrayToChart = (eventArray) => {
    eventArray = eventArray.reverse(); //reverse array to get oldest first

    let object = {
        amount: [],
        day: [],
        topRepositories: null,
    }

    let topRepositories = []

    for (let i = 0; i < eventArray.length; i++) { //Loops through commits
        const commit = eventArray[i];
        let date = moment(commit.created_at.split("T")[0]) //Converts date to momentObject
        let diff = date.diff(moment(object.day[object.day.length - 1]), "days")
        if (diff > 1) {
            let newDate = moment(object.day[object.day.length - 1])
            for (let i = 0; i < diff - 1; i++) {
                newDate.add(1, "days")
                object.day.push(newDate.format("YYYY-MM-DD"))
                object.amount.push(0)
            }
        }
        let index = object.day.findIndex((e) => e === date.format("YYYY-MM-DD")) //Checks if date is in date array
        if (index === -1) { // if date is not in array and either adds it or updates amount.
            object.day.push(date.format("YYYY-MM-DD"))
            object.amount.push(commit.payload.commits.length)
        } else {
            object.amount[index] += commit.payload.commits.length
        }

        let repoIndex = topRepositories.findIndex((e) => e.repo === commit.repo.name) //Checks if repo is in repo array
        if (repoIndex === -1) {
            topRepositories.push({
                repo: commit.repo.name,
                amount: commit.payload.commits.length
            })
        } else {
            topRepositories[repoIndex].amount += commit.payload.commits.length
        }
    }

    topRepositories.sort((a, b) => b.amount - a.amount) // Sorts array by no of commits
    object.topRepositories = topRepositories //Sets topRepositories to topRepositories in object

    return object
}

/**
 * @param  {array} dataPoints Data points for chart
 * @param  {array} categories Categories for chart
 * @param  {string} selector Selector (id, class etc. of DOM) to insert chart to
 * @param  {string} type Type of chart (line etc.)
 * @param  {string} name Name of Chart
 * 
 * Renders Chart to choosen DOM with inputed data
 */
renderChart = (dataPoints, categories, selector, type, name) => {
    if (dataPoints.length > 0) {
        var options = {
            chart: {
                type: type
            },
            series: [{
                name: name,
                data: dataPoints
            }],
            xaxis: {
                categories: categories
            }
        }

        var chart = new ApexCharts(document.querySelector(selector), options);

        chart.render();
        document.querySelector(selector).hidden = false;
    }
}