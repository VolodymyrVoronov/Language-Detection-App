const KEY_ENTER = 13;

const form = document.querySelector('.main-form');
const textToDetectInput = form.querySelector('.main-form__text-enter');
const detectBtn = form.querySelector('.main-form__btn');
const resultsOutput = document.querySelector('.app__results');

// get data from server

getResponse = async text => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const endpoint = 'http://api.languagelayer.com/detect?access_key=';
  const apiKey = '050e75323122ab7c32092011df465e4c';
  const query = `&query=${text}`;
  
  const response = await fetch(proxy + endpoint + apiKey + query);
  const data = await response.json();

  return data;
}

// check input field

checkAnyTextInTextarea = () => {  
  if (textToDetectInput.value.length > 0) {
    detectBtn.removeAttribute('disabled');
    detectBtn.classList.remove('main-form__btn--disabled');
  }
  if (textToDetectInput.value.length === 0) {
    detectBtn.setAttribute('disabled', 'disabled');
    detectBtn.classList.add('main-form__btn--disabled');
  }
}

// show results

showResults = data => {
  textToDetectInput.focus();
  resultsOutput.innerHTML = '';

  data.results.forEach(element => {
    const languageName = element.language_name;
    const probability = element.percentage;

    const html = `
    <ul class="app__output output">
      <li class="output__language">${languageName}</li>
      <li class="output__match">Match: ${Math.round(probability)} %</li>
    </ul>
  `;

    resultsOutput.innerHTML += html;

    const resultField = document.querySelectorAll('.output');
    resultField.forEach(element => {
      if (Math.round(probability) === 100) {
        element.classList.add('output--match-gb');
      }
    });
  });
}

// show progress bar

showProgressBar = () => {
  resultsOutput.innerHTML = '';
  html = `
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
  `;
  resultsOutput.innerHTML = html;
}

// disable check button

detectBtn.setAttribute('disabled', 'disabled');
detectBtn.classList.add('main-form__btn--disabled');
textToDetectInput.focus();

// listen to the input field

textToDetectInput.addEventListener('input', () => {
  checkAnyTextInTextarea();
  textToDetectInput.placeholder = textToDetectInput.value;
});

// listen to the click on button

detectBtn.addEventListener('click', e => {
  e.preventDefault();

  getResponse(textToDetectInput.value.trim())
    .then(data => showResults(data))
    .then(showProgressBar());

  form.reset();
  detectBtn.setAttribute('disabled', 'disabled');
  detectBtn.classList.add('main-form__btn--disabled');
});

// listen to the press the key enter

document.addEventListener('keydown', e => {
  if (e.keyCode === KEY_ENTER) {
    e.preventDefault();
    getResponse(textToDetectInput.value.trim())
      .then(data => showResults(data))
      .then(showProgressBar());

    form.reset();
    detectBtn.setAttribute('disabled', 'disabled');
    detectBtn.classList.add('main-form__btn--disabled');
  }
});
