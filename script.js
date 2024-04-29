'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// ----------------------------------------------

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2]; // ----------------------------------------------

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

/* Início */
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // método SORT
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (movement, i) {
    // cria os Tipos
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    // cria as Datas
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    // cria cada linha de Movimento pro HTML
    const html = `
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1}º ${type}</div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${movement.toFixed(2)}€</div>
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
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = acc.movements
    .filter(value => value < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(value => value > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // .filter((interest, i, array) => {
    //   console.log(array);
    //   return interest >= 1;
    // })
    .filter(interest => interest >= 1)
    .reduce((deposit, curr) => deposit + curr, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, curr) => sum + curr, 0);
  labelBalance.textContent = `${acc.balance}€`;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Event handlers */
let currentAccount;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

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
    // adiciona o valor
    currentAccount.movements.push(amount);

    // cria a nova data deste EMPRÉSTIMO para o array de 'movementsDates'
    currentAccount.movementsDates.push(new Date().toISOString());

    // atualiza a UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
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

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
