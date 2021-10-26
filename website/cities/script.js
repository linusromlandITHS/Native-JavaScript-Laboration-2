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

    setInterval(renderCitites, 5000);

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
        if (request.status === 201) {
            console.log(`Added city ${input.value} to Cities API`)
            responseMessage(`Added city "${input.value}" to Cities API`, "successMessage")
            input.value = ""
            populationInput.value = ""
            renderCitites()
        } else {
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

        let textContainer = document.createElement('div')

        let cityName = document.createElement('p')
        cityName.textContent = city.name

        let cityPopulation = document.createElement('p')
        cityPopulation.textContent = `${city.population} inhabitants`

        textContainer.append(cityName,cityPopulation)
    
        let buttonContainer = document.createElement('div')

        let editButton = document.createElement('button')
        let editSpan = document.createElement('span')
        editSpan.classList = "material-icons"
        editSpan.textContent = "edit"
        editButton.appendChild(editSpan)

        let deleteButton = document.createElement('button')
        let deleteSpan = document.createElement('span')
        deleteSpan.classList = "material-icons"
        deleteSpan.textContent = "delete"
        deleteButton.appendChild(deleteSpan)

        buttonContainer.append(editButton, deleteButton)

        container.append(textContainer, buttonContainer)
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