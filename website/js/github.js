getUser = async (username) => {
    let request = await fetch(`https://api.github.com/users/${username}`)
    let data = await request.json();
    console.log(data)
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