const usernameTag = document.querySelector("#username")
const loadingArea = document.querySelector("#loadingArea")
const main = document.querySelector("#main")
const noOfCommits = document.querySelector("#noOfCommits")

let user;
let name;

window.onload = async () => {
    //Convert URL to Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    //Gets user from GitHub API
    let user = await getUser(params.user);
    if (!user) window.location = "index.html"
    console.log("Loaded user data!")

    //Sets varible "name" to login or Username if exsits.
    name = user.name ? user.name : user.login;
    document.title = `${user.login} - Github Statistics`
    username.textContent = name

    let commits = await getCommits(user.login)
    let chartData = await commitsToChart(commits)
    await renderChart(chartData.amount, chartData.day, "#chart", "line", "Commits")

    loading(true)
    let noOfCommitsNum = 0;
    chartData.amount.forEach(amount => {
        noOfCommitsNum += parseInt(amount)
        console.log(amount)
    });
    noOfCommits.textContent = `Commits (${chartData.day[0]} - ${chartData.day[chartData.day.length -1]}): ${noOfCommitsNum}`

}

loading = (done) => {

    main.hidden = done ? false : true;
    loadingArea.hidden = done ? true : false
}

commitsToChart = (commitArray) => {
    commitArray = commitArray.reverse(); //reverse array to get oldest first
    let object = {
        amount: [],
        day: []
    }

    for (let i = 0; i < commitArray.length; i++) { //Loops through commits
        const commit = commitArray[i];
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
    }
    console.log(object)
    return object
}

renderChart = (dataPoints, categories, selector, type, name) => {
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
}