const form = document.querySelector("form")
const input = document.querySelector("input[type=text]")
const populationInput = document.querySelector("input[type=number]")
const submitButton = document.querySelector("input[type=submit]")
const response = document.querySelector("#response")
const citiesWrapper = document.querySelector("#cities-wrapper")
const editModal = document.querySelector("#editModal");
const deleteModal = document.querySelector("#deleteModal");

window.onload = () => {
    //Sets button to disabled by default
    submitButton.disabled = true;

    //Clears input field by default
    input.value = ""

    renderCitites()

    //Every 5 seconds updates citites from Avancera API
    // setInterval(renderCitites, 5000);
}

window.onclick = function (event) {
    if (event.target == editModal) {
        resetAnimation(editModal.children[0])
        editModal.children[0].style.animation = "shake 0.5s"
    } else if (event.target == deleteModal) {
        resetAnimation(deleteModal.children[0])
        deleteModal.children[0].style.animation = "shake 0.5s"
    }
}

/**
 * Runs on submit from main form and creates a new city
 */
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

/**
 * @param  {string} message Message to be shown in responsemessage
 * @param  {string} classes String of classes to be added to responsemessage
 * 
 * Displays a response with message and classes from input
 */
responseMessage = (message, classes) => {
    //Clears all previous response messages!
    response.innerHTML = '';
    let p = document.createElement('p')
    p.classList = classes
    p.textContent = message
    response.appendChild(p)
    response.hidden = false
}

/**
 * Retrives all the lastest cities from API and displays them
 */
renderCitites = async () => {
    let request = await fetch('https://avancera.app/cities/');
    let cities = await request.json();

    //Clears previous cities
    citiesWrapper.innerHTML = ""

    cities.forEach(city => {
        let container = document.createElement('div')
        container.classList = "card"
        container.title = city.name

        let textContainer = document.createElement('div')

        let cityName = document.createElement('p')
        cityName.textContent = city.name

        let cityPopulation = document.createElement('p')
        cityPopulation.textContent = `${city.population} ${city.population == "1" ? "inhabitant" : "inhabitants"}`

        textContainer.append(cityName, cityPopulation)

        let buttonContainer = document.createElement('div')

        let editButton = document.createElement('button')
        let editSpan = document.createElement('span')
        editSpan.classList = "material-icons"
        editSpan.textContent = "edit"
        editButton.onclick = () => {
            updateEditModal(city)
        }
        editButton.appendChild(editSpan)

        let deleteButton = document.createElement('button')
        let deleteSpan = document.createElement('span')
        deleteSpan.classList = "material-icons"
        deleteSpan.textContent = "delete"
        deleteButton.onclick = () => {
            updateDeleteModal(city)
        }
        deleteButton.appendChild(deleteSpan)

        buttonContainer.append(editButton, deleteButton)

        container.append(textContainer, buttonContainer)
        citiesWrapper.appendChild(container)
    });
}

deleteCity = async (id) => {
    await fetch(`https://avancera.app/cities/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
    })
    changeVisibilityModal(deleteModal)
    renderCitites()
}

/**
 * @param  {string} name New name for city
 * @param  {integer} pop New Population for city
 * @param  {object} object Object containg all information about city
 * 
 */
editCityValue = async (name, pop, object) => {
    let obj = {};
    if (name.value && object.name != name.value) obj.name = name.value;
    if (pop.value && object.population != parseInt(pop.value)) obj.population = parseInt(pop.value);


    if (object.id && !(!name.value && !pop.value)) {
        let request = await fetch(`https://avancera.app/cities/${object.id}`, {
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
            method: "PATCH",
        })
        changeVisibilityModal(editModal)
        renderCitites()
    }
}

/**
 * @param  {object} object Input of city object from Avancera API
 * 
 * Updates the edit modal to correct values
 */
updateEditModal = (object) => {
    editModal.children[0].style.animation = ""
    const editCityName = document.querySelector("#editCityName")
    const editCityPopulation = document.querySelector("#editCityPopulation")

    editCityName.value = object.name
    editCityPopulation.value = object.population
    document.querySelector("#saveBtn").onclick = () => {
        editCityValue(editCityName, editCityPopulation, object)
    }
    document.querySelector("#editCancel").onclick = () => {
        changeVisibilityModal(editModal)
    }

    changeVisibilityModal(editModal)
}

/**
 * @param  {object} object Input of city object from Avancera API
 * 
 * Updates the delete modal to correct values
 */
updateDeleteModal = (object) => {
    deleteModal.children[0].style.animation = ""
    const delBtn = document.querySelector("#delBtn")
    changeVisibilityModal(deleteModal)
    document.querySelector("#delConfirmText").textContent = `You are about to delete the city ${object.name}! Are you sure you want to do this?`
    delBtn.textContent = `Yes, delete the city ${object.name}`
    delBtn.onclick = () => {
        deleteCity(object.id)
    }
    document.querySelector("#delCancel").onclick = () => {
        changeVisibilityModal(deleteModal)
    }
}

/**
 * @param  {HTMLDivElement} modal Div element reprensenting the modal content
 * 
 * Sets CSS to show or hide inputed modal
 */
changeVisibilityModal = (modal) => {
    if (modal.style.display != "block") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

/**
 * Function that checks if input fields are empty and enables disables button
 */
checkStatus = () => {
    submitButton.disabled = !((input.value.length > 0) && (populationInput.value > 0))
}

resetAnimation = (el) => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = null; 
  }

/*
 * Add event listener for input on both name and population to update if button is enabled or disabled.
 */
input.addEventListener("input", checkStatus)
populationInput.addEventListener("input", checkStatus)