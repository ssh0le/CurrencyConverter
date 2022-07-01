let fromInput = document.querySelector('#from-wrapper .input-field');
let toInput = document.querySelector('#to-wrapper .input-field');
let toList = document.querySelector('#to-currency-list'),
  fromList = document.querySelector('#from-currency-list'),
  baseList = document.querySelector('#basic-currency-list');
let rates;
let currencies = [];
let defToCurrency = 'RUB';
let sourceBaseCurrency;
let apiUrl = 'https://cdn.cur.su/api/nbu.json';
let keyUpEvent = new Event('keyup');
let terminalButton = document.querySelector('#terminal-button')

window.addEventListener('load', () => {
  fetch(apiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rates = data.rates;
      sourceBaseCurrency = data.base;
      setAllData();
    });
});

fromInput.addEventListener('mouseup', () => {
  toInput.value = convertCurrency(fromList.value, fromInput.value, toList.value);
});
fromInput.addEventListener('keyup', () => {
  toInput.value = convertCurrency(fromList.value, fromInput.value, toList.value);
});
toInput.addEventListener('mouseup', () => {
  fromInput.value = convertCurrency(toList.value, toInput.value, fromList.value);
});
toInput.addEventListener('keyup', () => {
  fromInput.value = convertCurrency(toList.value, toInput.value, fromList.value);
});
fromList.addEventListener('change', () => {
  fromInput.dispatchEvent(keyUpEvent);
});
toList.addEventListener('change', () => {
  fromInput.dispatchEvent(keyUpEvent);
});
baseList.addEventListener('change', () => {
  setBasicCurrency(baseList.value);
  createRates(baseList.value);
})
terminalButton.addEventListener('click', () => {
  let terminal = document.querySelector('#terminal');
  completeCommand(terminal.value);
  terminal.value = '';
});

function setAllData() {
  let baseCurrency = getBasicCurrency();
  setSortedCurrencies(rates);
  createRates(baseCurrency);
  setFromCurrencyList(baseCurrency);
  if (baseCurrency == defToCurrency) {
    setToCurrencyList('USD');
  } else {
    setToCurrencyList(defToCurrency);
  }
  setCurrencyList(baseCurrency, baseList);
}

function setSortedCurrencies(rates) {
  for (currency in rates) {
    currencies.push(currency);
  }
  currencies.sort();
}

function getBasicCurrency() {
  if (localStorage.getItem('baseCurrency') == undefined) {
    localStorage.setItem('baseCurrency', sourceBaseCurrency);
  }
  return localStorage.getItem('baseCurrency');
}

function setBasicCurrency(currency) {
  localStorage.setItem('baseCurrency', currency);
}

function createRates(baseCurrency) {
  let ratesBaseCurrency = document.querySelector('.rates-label .basic-currency');
  ratesBaseCurrency.textContent = baseCurrency;
  let rateList = document.querySelector('.rates-list');
  rateList.innerHTML = '';
  for (curr of currencies) {
    if (curr != baseCurrency) {
      rateList.append(createRate(curr, baseCurrency));
    }
  }
}

function createElement(tag, classList) {
  let element = document.createElement(tag);
  element.classList.add(classList);
  return element;
}

function createRate(currency, baseCurrency) {
    let rate = createElement('tr', 'currency-rate');
    let currencyAbbr = createElement('td', 'currency-abbr');
    currencyAbbr.textContent += currency;
    let currencyEquivalent = createElement('td', 'currency-equivalent');
    let amount = rates[currency] / rates[baseCurrency];
    currencyEquivalent.textContent += amount.toFixed(2);
    rate.append(currencyAbbr, currencyEquivalent);
    return rate;
}

function setCurrencyList(selectedCurrency, list) {
  list.innerHTML = '';
  for (currency of currencies) {
    if (currency === selectedCurrency) {
      list.innerHTML += createOption(true, currency);
    } else {
      list.innerHTML += createOption(false, currency);
    }
  }
}

function setFromCurrencyList(selectedCurrency) {
  setCurrencyList(selectedCurrency, fromList);
}

function setToCurrencyList(selectedCurrency) {
  setCurrencyList(selectedCurrency, toList);
}

function createOption(isSelected, content) {
  return `<option value="${content}" ${isSelected ? 'selected' : ''}>${content}</option>\n`;
}

function convertCurrency(fromCurrency, fromAmount, toCurrency) {
  return (rates[toCurrency] / rates[fromCurrency] * fromAmount).toFixed(3);
}

function completeCommand(command) {
  let parts = command.split(' ').filter(el => el != '');
  if (parts.length != 4) {
    return;
  }
  if (typeof(parseFloat(parts[0])) != 'number') {
    console.log('Not number');
    return;
  }
  if (!checkCurrency(parts[1].toUpperCase())) {
    alert(`Unknown currency \'${parts[1]}\'`);
    return;
  }
  if (!checkCurrency(parts[3].toUpperCase())) {
    alert(`Unknown currency \'${parts[3]}\'`);
    return;
  }
  setFromCurrencyList(parts[1].toUpperCase());
  setToCurrencyList(parts[3].toUpperCase());
  fromInput.value = parts[0];
  fromInput.dispatchEvent(keyUpEvent);
}

function checkCurrency(currency) {
  return currencies.indexOf(currency) < 0 ? false : true;
}