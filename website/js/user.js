const usernameTag = document.querySelector("#username")
const loadingArea = document.querySelector("#loadingArea")
const main = document.querySelector("#main")

let user;
let name;
window.onload = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let user = await getUser(params.user);
    if (!user) window.location = "index.html"
    console.log("Loaded user data!")
    name = user.name ? user.name : user.login;
    document.title = `${user.login} - Github Statistics`
    username.textContent = name
    loading(true)
    let commits = await getCommits(user.login)
    let chartData = await commitsToChart(commits)

    renderChart(chartData.amount, chartData.day, "#chart", "line", "Commits")
}

loading = (done) => {

    main.hidden = done ? false : true;
    loadingArea.hidden = done ? true : false
}

commitsToChart = (commitArray) => {
    commitArray = commitArray.reverse();
    let object = {
        amount: [],
        day: []
    }
    for (let i = 0; i < commitArray.length; i++) {
        const commit = commitArray[i];
        for (let j = 1; j < commitArray.length; j++) {
            const event = commitArray[j];
            if (commit.created_at.split("T")[0] === event.created_at.split("T")[0]) {
                commit.payload.commits = commit.payload.commits.concat(event.payload.commits)
                commitArray.splice(j, 1)
                j--
            }
        }
        let uniqueCommits = commit.payload.commits.filter(function (item, pos) {
            return commit.payload.commits.indexOf(item) == pos;
        })
        object.amount.push(uniqueCommits.length)
        object.day.push(commit.created_at.split("T")[0])
    }
    console.log(object)
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