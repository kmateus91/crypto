const init = (callback) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert("No se encuentra logueado, por favor inicie sesion");
    window.location = 'login.html';
  }
  axios.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer " + token;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  callback && callback()
}

const switchFormDisabled = () => {
  const disabableElements = document.getElementsByClassName("form-disabable");
  for (const element of disabableElements) {
    element.disabled = !element.disabled;
  }
}

const calculatePU = async () => {
  const toCurrencyInput = document.getElementById("to-currency-select");
  const fromCurrencyInput = document.getElementById("from-currency-select");
  const unitPriceInput = document.getElementById("PU-right");
  const exchangeRate = await getExchangeRate(fromCurrencyInput.value, toCurrencyInput.value);
  unitPriceInput.value = exchangeRate;
}

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const url = `http://localhost:5000/api/v1/exchangerate/${fromCurrency}/${toCurrency}`;
    const response = await axios.get(url);
    return response?.data?.data?.exchange_rate;
  }
  catch (err) {
    alert(err).response.data.message;
  }
}

const getStatus = async () => {
  try {
    const url = `http://localhost:5000/api/v1/status`;
    const response = await axios.get(url);
    return response?.data?.data;
  }
  catch (err) {
    console.log(err);
    return null;
  }
}

const clearTransaction = () => {
  const fromQuantityInput = document.getElementById("Q-left");
  const toQuantityInput = document.getElementById("Q-right");
  const unitPriceInput = document.getElementById("PU-right");

  fromQuantityInput.value = "";
  toQuantityInput.value = "";
  unitPriceInput.value = "";
}

const addTransaction = () => {
  const fromCurrencyInput = document.getElementById("from-currency-select");
  const toCurrencyInput = document.getElementById("to-currency-select");
  const fromQuantityInput = document.getElementById("Q-left");
  const toQuantityInput = document.getElementById("Q-right");
  const unitPriceInput = document.getElementById("PU-right");

  if(fromCurrencyInput.value === toCurrencyInput.value){
    alert("No puedes grabar con las dos currencies iguales");
    return;
  }

  postTransaction(
    fromCurrencyInput.value,
    toCurrencyInput.value,
    fromQuantityInput.value,
    toQuantityInput.value,
    unitPriceInput.value
  )
}

const createTableRow = (cellValues) => {
  const element = document.createElement("tr");
  for (const cellText of cellValues) {
    const tableCell = createTableCell(cellText);
    element.appendChild(tableCell);
  }
  return element;
}

const createTableCell = (text) => {
  const element = document.createElement("th");
  element.textContent = text;
  return element;
}

const postTransaction = (
  from_currency,
  to_currency,
  from_quantity,
  to_quantity
) => {
  axios.post('http://localhost:5000/api/v1/transaction', {
    from_currency,
    to_currency,
    from_quantity,
    to_quantity
  })
    .then(result => {
      getTransactionsCall();
      handleGetStatus();
    })
    .catch(err => {
      alert(err.response.data.message.from_currency);
    })
}

const getTransactionsCall = () => {
  axios.get('http://localhost:5000/api/v1/transaction')
    .then(response => {
      renderTransactions(response.data.data)
    })
    .catch(error => console.error(error));
};

const renderTransactions = (data) => {
  const table = document.getElementById('table')

  while (table.childNodes.length > 2) {
    table.removeChild(table.lastChild);
  }

  data.forEach(transaction => {
    const row = createTableRow([
      moment(transaction["created_at"]).format('DD/MM/YYYY'),
      moment(transaction["created_at"]).format('HH:mm:ss'),
      transaction["from_currency"],
      transaction["from_quantity"],
      transaction["to_currency"],
      transaction["to_quantity"]
    ])
    row.classList.add('dashboard-row');
    table.appendChild(row)
  })
}

const handleGetStatus = async () => {
  const { invested, current_value } = await getStatus()
  document.getElementById('value-invertido').innerText = parseFloat(invested).toFixed(2) + " €";
  document.getElementById('value-valor').innerText = parseFloat(current_value).toFixed(2) + " €";
  const resultado = document.getElementById('value-resultado')
  resultado.innerText = parseFloat(current_value - invested).toFixed(2) + " €";
  if (current_value < invested) {
    resultado.classList.add('negative')
  }
}

const addEventListeners = () => {
  const addTransactionButton = document.getElementById("add-transaction");
  const clearTransactionButton = document.getElementById("clear-transaction");
  const calculateButton = document.getElementById("calculate");
  const switchDisabled = document.getElementById("switch-disabled");

  addTransactionButton.addEventListener('click', addTransaction, false);
  clearTransactionButton.addEventListener('click', clearTransaction, false);
  calculateButton.addEventListener('click', calculatePU, false);
  switchDisabled.addEventListener('click', switchFormDisabled, false);

}

init(async () => {
  getTransactionsCall();
  await handleGetStatus();
  addEventListeners();
});
