//Location 
const partialLocation = "partials/"

initPartials = () => {
    let partialNodes = document.querySelectorAll('[data-partials]')

    partialNodes.forEach(async element => {
        let elementName = element.getAttribute('data-partials')
        let request = await fetch(partialLocation + elementName)
        let htmlResponse = await request.text();
        if(request.status == 200){
            element.innerHTML = htmlResponse
        }else{
            console.error(`Error! Could not get ${elementName}`)
        }
    });
}