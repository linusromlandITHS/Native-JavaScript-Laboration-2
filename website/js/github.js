getUser = async (username) => {
    let request = await fetch(`https://api.github.com/users/${username}`)
    if(request.status === 404) return null;
    let data = await request.json();
    return data;
}

getRepo = async (repo) => {
    let request = await fetch(`https://api.github.com/repo/${repo}`)
    if(request.status === 404) return null;
    let data = await request.json();
    return data;
}

searchUser = async (username) => {
    const request = await fetch(`https://api.github.com/search/users?q=${username}`)
    const data = await request.json();
    let users = data.items;
    while (true) {
        let index = users.findIndex(o => o.type === "Organization")
        if (index === -1){
            break;
        }else{
            users.splice(index, 1)
        } 
    }


    console.log(users)
}