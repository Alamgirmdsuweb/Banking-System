var user = [
    {
        id: 1,

        Email: "Suweb@gmail.com",
        password: "1234",
    },
    {
        id: 2,

        Email: "Suweb1@gmail.com",
        password: "1234",
    },
    {
        id: 3,

        Email: "Suweb2@gmail.com",
        password: "1234",
    },
];

var userEmail;
const dbConnection = () => {
    const dbName = "UserData";

    const request = indexedDB.open(dbName, 2);

    request.onerror = (event) => {};

    let StoreData = [];

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        const objectStore = db.createObjectStore("alldata", {
            keyPath: "User",
            autoIncrement: true,
        });

        objectStore.transaction.oncomplete = (event) => {
            let LoginObjectStore = db
                .transaction("alldata", "readwrite")
                .objectStore("alldata");
            user.forEach((id) => {
                LoginObjectStore.add(id);
            });
        };
    };

    request.onsuccess = (event) => {
        const db = event.target.result;

        let LoginObjectStore = db
            .transaction("alldata", "readwrite")
            .objectStore("alldata");
        LoginObjectStore.oncomplete = (ev) => {
            let getReq = LoginObjectStore.getAll();
            console.log(getReq);
            getReq.onsuccess = (e) => {
                e.preventDefault();
                let newRequest = e.target;

                StoreData = [...newRequest.result];

                
            };
            getReq.onerror = (e) => {
                console.log("error");
            };
        };
    };
};
dbConnection();

// store Login form Data

function Submit() {
    userEmail = document.getElementById("email").value;

    UserPassword = document.getElementById("password").value;

    let Time;
    let flag = false;
    for (var i = 0; i < user.length; i++) {
        if (userEmail === user[i].Email && UserPassword === user[i].password) {
            Time = DateTime();

            window.location.href = `Banking.html?name${user[i].id}`;

            flag = true;
            break;
        }
    }
    if (!flag) {
        document.getElementById("error").innerHTML =
            "<span style='color:red'>Please input  your current email or password !!</span>";
    }
}

function DateTime() {
    var date = new Date();
    var hours = date.getHours();
    var days = date.getDay();
    var minutes = date.getMinutes();
    var AMPM = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var Time = date.toDateString() + " " + hours + ":" + minutes + " " + AMPM;
    return Time;
}

function  clearFuncunction() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}
