import './css/styles.css';
import Notiflix from 'notiflix';

import debounce from "lodash.debounce";
import fetchCountries from "./components/fetchCountries";

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector("input"),
    listEl: document.querySelector(".country-list")
}

refs.input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));


function onInput(event) {
    const searchQuery = event.target.value.trim();
    console.log(searchQuery)
    
    if (searchQuery !== "") {
        fetchCountries(searchQuery)
        .then(showCountries)
        .catch(showError);
    }
}

function showCountries(data) {
    refs.listEl.innerHTML = "";

    if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
    if (data.length >= 2 && data.length <= 10) {

        const markup = data.map(({ name, flags }) => {
            return `<li class="contries-name">
                <img src="${flags.svg}" alt="flag" width="50"></img>
                <p>${name.official}</p>
            </li>`
        }).join("");
        
        refs.listEl.innerHTML = markup;
    }
    if (data.length === 1) {
        const { name, capital, population, flags, languages } = data[0];

        refs.listEl.innerHTML = `<li>
                <div class="contries-name"><img src="${flags.svg}" alt="flag" width="60"></img>
                <span class="name-countries">${name.official}</span></div>
                <p><strong>Capital</strong>: ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Languages:</strong> ${Object.values(languages).map(el => {return el}).join(", ")}</p>
            </li>`;
    }
}

function showError(error) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}