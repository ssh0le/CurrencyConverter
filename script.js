let sw = document.querySelector('#switch');
let rates;
let currencies = [];
let defToCurrency = 'RUB';
let sourceBaseCurrency;
let apiUrl = 'https://cdn.cur.su/api/nbu.json';
window.addEventListener('load', () => {
  fetch(apiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      rates = data.rates;
      sourceBaseCurrency = data.base;
      console.log(sw);
      setAllData();
    });
});

sw.addEventListener('click', () => {
  sw.classList.toggle('rotate');
  switchCurrencyList();
});

sw.addEventListener('animationend', () => {
  sw.classList.remove('rotate');
});

function setAllData() {
  let baseCurrency = getBaseCurrency();
  setSortedCurrencies(rates);
  createRates(baseCurrency);
  setFromCurrencyList(baseCurrency);
  setToCurrencyList(defToCurrency);
}

function setSortedCurrencies(rates) {
  for (currency in rates) {
    currencies.push(currency);
  }
  currencies.sort();
}

function getBaseCurrency() {
  if (localStorage.getItem('baseCurrency') == undefined) {
    localStorage.setItem('baseCurrency', sourceBaseCurrency);
  }
  return localStorage.getItem('baseCurrency');
}

function createRates(baseCurrency) {
  let ratesBaseCurrency = document.querySelector('.rates-label .basic-currency');
  ratesBaseCurrency.textContent = baseCurrency;
  let rateList = document.querySelector('.rates-list');
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
    let rate = createElement('div', 'currency-rate');
    let currencyAbbr = createElement('div', 'currency-abbr');
    currencyAbbr.textContent += currency;
    let currencyEquivalent = createElement('div', 'currency-equivalent');
    let amount = rates[currency] / rates[baseCurrency];
    currencyEquivalent.textContent += amount.toFixed(2);
    rate.append(currencyAbbr, currencyEquivalent);
    return rate;
}

function setCurrencyList(selectedCurrency, listSelector) {
  let list = document.querySelector(listSelector);
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
  setCurrencyList(selectedCurrency, '#from-currency-list');
}

function setToCurrencyList(selectedCurrency) {
  setCurrencyList(selectedCurrency, '#to-currency-list');
}

function createOption(isSelected, content) {
  return `<option value="${content}" ${isSelected ? 'selected' : ''}>${content}</option>\n`;
}

function switchCurrencyList() {
  let toList = document.querySelector('#to-currency-list'),
    fromList = document.querySelector('#from-currency-list');
  let toValue = toList.value,
    fromValue = fromList.value;
  setToCurrencyList(fromValue);
  setFromCurrencyList(toValue);
}