const form = document.querySelector("form")
const input = document.querySelector("input[type=text]")
const populationInput = document.querySelector("input[type=number]")
const submitButton = document.querySelector("input[type=submit]")
const response = document.querySelector("#response")
const citiesWrapper = document.querySelector("#cities-wrapper")

window.onload = () => {
    //Sets button to disabled by default
    submitButton.disabled = true;

    //Clears input field by default
    input.value = ""

    renderCitites()

}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (input.value && populationInput.value) {
        let request = await fetch('https://avancera.app/cities/', {
            body: JSON.stringify({
                name: input.value,
                population: parseInt(populationInput.value)
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        if(request.status === 201){
            console.log(`Added city ${input.value} to Cities API`)
            responseMessage(`Added city "${input.value}" to Cities API`, "successMessage")
            input.value = ""
            populationInput.value = ""
        }else{
            let error = await request.json();
            console.log(`Error! ${error.error}`)
            responseMessage(`Error! ${error.error}`, "errorMessage")
        }

    }
})


responseMessage = (message, classes) => {
    //Clears all previous response messages!
    response.innerHTML = '';
    let p = document.createElement('p')
    p.classList = classes
    p.textContent = message
    response.appendChild(p)
    response.hidden = false
}

renderCitites = async () => {
    let request = await fetch('https://avancera.app/cities/');
    let cities = await request.json();
    
    //Clears previous cities
    citiesWrapper.innerHTML = ""

    cities.forEach(city => {
        let container = document.createElement('div')
        container.classList = "card"

        let cityName = document.createElement('p')
        cityName.textContent = city.name

        let cityPopulation = document.createElement('p')
        cityPopulation.textContent = city.population

        let editButton = document.createElement('button')
        editButton.textContent = "Edit"

        let deleteButton = document.createElement('button')
        deleteButton.textContent = "Delete"

        container.append(cityName, cityPopulation, editButton, deleteButton)
        citiesWrapper.appendChild(container)
    });
}

/**
 * Function that checks if input fields are empty and enables disables button
 */
checkStatus = () => {    
    submitButton.disabled = !((input.value.length > 0) && (populationInput.value > 0))
}

input.addEventListener("input", checkStatus)
populationInput.addEventListener("input", checkStatus)