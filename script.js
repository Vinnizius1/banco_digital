// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////
/* Início */
///////////////////

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    // Adicionaremos Math.abs() para não importar se 'date1' é ou não antes de 'date2'
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  // 1000: converte de milissegundos para 1 segundo
  // 60 seg: converte para minuto
  // 60 min: converte para hora
  // 24 horas: converte para dia

  const daysPassed = calcDaysPassed(new Date(), date);

  // Lógica para deixar as datas RECENTES mais elegantes
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // método SORT
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (movement, i) {
    // cria os Tipos
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    // pega cada Data pelo seu índice e exporta para a função 'formatMovementDate(date)'
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // formatação dos números de acordo com a moeda (currency) JÁ INSERIDA na conta de cada usuário
    // const formattedMov = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(movement);
    const formattedMov = formatCurrency(movement, acc.locale, acc.currency);

    // cria cada linha de Movimento pro HTML
    const html = `
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1}º ${type}</div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${formattedMov}</div>
</div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsername = function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};
createUsername(accounts);

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(value => value > 0)
    .reduce((acc, curr) => acc + curr, 0);
  // labelSumIn.textContent = `${income.toFixed(2)}€`;
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  const out = acc.movements
    .filter(value => value < 0)
    .reduce((acc, curr) => acc + curr, 0);
  // labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(value => value > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((deposit, curr) => deposit + curr, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, curr) => sum + curr, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );

  // labelBalance.textContent = `${acc.balance}`;
  // acc.balance = balance;
};

const updateUI = function (acc) {
  // Display summary
  calcDisplaySummary(acc);

  // Display movements
  displayMovements(acc);

  // Display balance
  displayBalance(acc);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Event handlers */
let currentAccount;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // '.pin' somente será lido SE 'currentAccount' existir!
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Hello, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;

    // cria a data e hora atual
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Nova lógica
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    // const local = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// TRANSFERÊNCIA
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // seleciona o input convertendo-o em "number"
  const amount = +inputTransferAmount.value;

  // ache o recebedor dentro do array de "contas" utilizando como critério o "username" (abreviação dos nomes q criamos acima)
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // faça a condição/validação para então fazermos a transferência do valor
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // faz a transferência
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // limpa os campos
    inputTransferAmount.value = inputTransferTo.value = '';

    // cria a nova data desta TRANSFERÊNCIA para o array de 'movementsDates'
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});

// EMPRÉSTIMO
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // "setTimeout(){}"" simplesmente agenda uma função para ocorrer em um determinado tempo. Esta função é executada apenas 1 vez.
    setTimeout(function () {
      // adiciona o valor
      currentAccount.movements.push(amount);

      // cria a nova data deste EMPRÉSTIMO para o array de 'movementsDates'
      currentAccount.movementsDates.push(new Date().toISOString());

      // atualiza a UI
      updateUI(currentAccount);

      inputLoanAmount.value = '';
    }, 2500);
  }
});

// DELETA CONTA
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Deleta a conta
    accounts.splice(index, 1);

    // Oculta a Interface do Usuário
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// MÉTODO 'SORT'
let sort = false;
// a variável 'sort' fica fora para assim presevarmos seu valor
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sort);
  // aqui em cada clique alterará o valor de sort:
  sort = !sort;
});

/* FAKE ALWAYS LOGGED IN */
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

/* Experimenting API */
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// const local = navigator.language;

// labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
