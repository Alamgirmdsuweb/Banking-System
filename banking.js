let table = [];
let array = [];
let PreviousTotalAmount = [];
let preTotalDeposit = [];

//Logout
document.getElementById("button").onclick = function () {
    location.href = "index.html";
};

let DB;

var id = location.search.split("name")[1];

// create the database idexedDB

const Bank = "LoginData";
let request = window.indexedDB.open("Bank", 1);

request.onerror = function () {};

request.onsuccess = function () {
    DB = request.result;

    showData();
};

request.onupgradeneeded = function (e) {
    let db = e.target.result;

    let objectStore = db.createObjectStore("Data", { autoIncrement: true });
    objectStore.createIndex("Type", "Type", { unique: false });
    objectStore.createIndex("User_Id", "User_id", { unique: false });
    objectStore.createIndex("Previous_total_Deposit", "Previous_total_Deposit", { unique: false } );
    objectStore.createIndex("PrevioustotalWithdraw", "PrevioustotalWithdraw", { unique: false});
    objectStore.createIndex("Amount", "Amount", { unique: false });
    objectStore.createIndex("Previous_Balance", "Previous_Balance", { unique: false});
    objectStore.createIndex("Current_Balance", "Current_Balance", {unique: false});
    objectStore.createIndex("Time", "Time", { unique: false });
};

function addData(data) {
    let transaction = DB.transaction("Data", "readwrite");
    let objectStore = transaction.objectStore("Data");

    let request = objectStore.add(data);

    request.onsuccess = () => {};
    transaction.oncomplete = () => {
        showData();
    };
    transaction.onerror = () => {};
}

// indexedDB  
function getDeposit() {
    let Deposit = 0;
    array.forEach((e) => (Deposit = e.Type === "Deposit" ? e.Amount : Deposit));
    document.getElementById("deposit-total").innerHTML = Deposit;

    return Deposit;
}
function getwidthdraw() {
    let widthdraw = 0;
    array.forEach(
        (e) => (widthdraw = e.Type === "Widthdraw" ? e.Amount : widthdraw)
    );

    document.getElementById("widthdraw-total").innerHTML = widthdraw;
    return widthdraw;
}

function showData() {
    let StoreData = [];
    let transaction = DB.transaction("Data", "readwrite");
    let objectStore = transaction.objectStore("Data");
    let getReq = objectStore.getAll();
    getReq.onsuccess = (e) => {
        let data = [];
        let newRequest = e.target;
        StoreData = [...newRequest.result];
        let store = [];

        for (let i = 0; i < StoreData.length; i++) {
            if (StoreData[i].User_id === id) {
                store.push(StoreData[i]);
            }
        }

        var maxIndex;
        maxIndex = store.length - 1;

        let newArray = [];

        newArray.push(store[maxIndex]);

        document.getElementById("balance-total").innerHTML =
            store[maxIndex].Current_Balance;

        store.forEach((u) => {
            let log = document.createElement("li");
            array.push(u);

            data += log.innerHTML = `<tr>
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.User_id}<span></p></td>             
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.Type}<span></p></td>
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.Amount}<span></p></td>     
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.Previous_total_Deposit}<span></p></td> 
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.PrevioustotalWithdraw}<span></p></td> 
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.Previous_Balance}<span></p></td> 
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.Current_Balance}<span></p></td>
                 <td><p class="font-weight-bold"> <span class="font-weight-normal">${u.Time}<span></p></td></tr>

`;
        });

        getDeposit();
        getwidthdraw();
        document.getElementById("myTable").innerHTML = data;
    };
}

//  input value
function getInputValue(inputId) {
    const inputField = document.getElementById(inputId);

    let inputAmountT = inputField.value;
    if (!inputAmountT || inputAmountT == "") inputAmountT = 0;
    const InputBalance = parseFloat(inputAmountT);

    //  clear input field

    inputField.value = "";

    return InputBalance;
}


function updateTotalField(value, amount) {
    const showBalance = document.getElementById(value);

    const previousBalance = showBalance.innerText;

    const previousTotal = parseFloat(previousBalance);

    showBalance.innerText = parseFloat(previousTotal + amount);
}

function getCurrentBalance() {
    const balanceTotal = document.getElementById("balance-total");

    const previousBalanceCheck = balanceTotal.innerText;

    const previousBalanceTotal = parseFloat(previousBalanceCheck);

    return previousBalanceTotal;
}

function updateBalance(amount, Add) {
    document.getElementById("balance-total");
    const previousBalanceTotal = getCurrentBalance();

    if (Add == true) {
        previousBalanceTotal + amount;
    } else {
        previousBalanceTotal - amount;
    }
}

//Previous_Total_deposit function
function previousTotalDeposit() {
    let sum = 0;
    for (let i = 0; i < preTotalDeposit.length; i++) {
        sum += preTotalDeposit[i];
    }
    return sum;
}

// deposit side
document
    .getElementById("deposit-button")
    .addEventListener("click", function () {
        const depositAmount = getInputValue("deposit-input");
        if (depositAmount == 0) return;
        preTotalDeposit.push(depositAmount);

        if (!depositAmount) return;
    
        
        if (depositAmount <= 0) return;

        const preDeposit = previousTotalDeposit();
       
        var id = location.search.split("name")[1];

        const previousBalance = getCurrentBalance("deposit-input");

        const DepositTotalAmount = getCurrentBalance("balance-total") + depositAmount;

        const time = DateTime(depositAmount);

        const values = {
            User_id: id,
            Type: "Deposit",
            Amount: depositAmount,
            Previous_total_Deposit: preDeposit,
            PrevioustotalWithdraw: 0,
            Previous_Balance: previousBalance,
            Current_Balance: DepositTotalAmount,
            Time: time,
        };

        table.push(values);
        addData(values);

        if (depositAmount > 0) {
            updateTotalField("deposit-total", depositAmount);

            updateBalance(depositAmount, true);
        } 
    });

//Previous_Total_Withdraw function
function totalwithdraw() {
    let sum = 0;

    for (let i = 0; i < PreviousTotalAmount.length; i++) {
        sum += PreviousTotalAmount[i];
    }

    return sum;
}

//  withdraw side

document
    .getElementById("Withdraw-button")
    .addEventListener("click", function () {
        const withdrawAmount = getInputValue("Withdraw-input");
        if (withdrawAmount == 0) return;
        PreviousTotalAmount.push(withdrawAmount);

        const withdraw = totalwithdraw(withdrawAmount);

        if (!withdrawAmount) return;

        var id = location.search.split("name")[1];

        const previousBalanceTotal = getCurrentBalance("Withdraw-input");

        const Totalwithdraw =
            getCurrentBalance("balance-total") - withdrawAmount;

        if (Totalwithdraw <= 0) return;

        const time = DateTime(withdrawAmount);

        const values = {
            User_id: id,
            Type: "Widthdraw",
            Amount: withdrawAmount,
            Previous_total_Deposit: 0,
            PrevioustotalWithdraw: withdraw,
            Previous_Balance: previousBalanceTotal,
            Current_Balance: Totalwithdraw,
            Time: time,
        };
        table.push(values);
        addData(values);

        if (withdrawAmount > 0) {
            updateTotalField("widthdraw-total", withdrawAmount);

            updateBalance(withdrawAmount, false);
       
        } 
    });

function DateTime() {
    var date = new Date();
    var hours = date.getHours(); 
    var minutes = date.getMinutes();
    var AM_PM = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = date.toDateString() + " " + hours + ":" + minutes + " " + AM_PM;
    return strTime;
}
