let fiveCoinsArray = []; // המערך של החמישה מטבעות שנבחרו, גלובלי
let interval = null;
let array100 = [];  // מערך ריק שיוספו אליו מאה המטבעות מהאי-פי-איי

window.addEventListener("load", function () {
    firstApi()
    const cardDiv = document.getElementById("cardDiv");
    const aboutButton = document.getElementById("about");
    aboutButton.addEventListener("click", function () {
        const myChart = document.getElementById("myChart");
        myChart.style.display = "none"; // הקנבאס של הגרפים הופל לבלתי נראה כדי שלא יופיע בחלונות האחרים באתר
        if (interval) clearInterval(interval) // כשעוברים חלון שתיפסק הריצה של הגרף - דרך קליר אינטרבל וגם בחלונות האחרים זה מועתק למטה
        openAbout(); // קורא לפונקציה למטה שמציגה את החלונית של עוד מידע
    });
    const homeButton = document.getElementById("homeButton");
    homeButton.addEventListener("click", function () {
        const myChart = document.getElementById("myChart");
        myChart.style.display = "none";
        if (interval) clearInterval(interval)
        // const cardDiv = document.getElementById("cardDiv");
        cardDiv.innerHTML = ""; // מנקה את התוכן של הדיב כדי שלא יוצגו לי האלמנטים הקודמים ושתיווצר הופעה ריקה
        firstApi();
    });
    const reportsButton = document.getElementById("liveReports");
    reportsButton.addEventListener("click", function () {
        const myChart = document.getElementById("myChart");
        myChart.style.display = "none";
        if (interval) clearInterval(interval)
        cardDiv.innerHTML = "";
        openLiveReports();
    });
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", () => {
        const myChart = document.getElementById("myChart");
        myChart.style.display = "none";
        if (interval) clearInterval(interval)
        const searchInput = document.getElementById("searchInput");
        const searchValue = searchInput.value; // הואליו של השורת חיפוש
        if (searchValue == "") { // אם השורת חיפוש ריקה
            cardDiv.innerHTML = ""; // תנקה לי את הדיב שיהיה ריק שיופיע לי חלון כאילו חדש
            const searchErrorMessage = document.createElement("h3"); // יוצר כותרת שעליה אכתוב את ההודעת שגיאה
            searchErrorMessage.innerHTML = "Please enter a coin symbol to search";
            cardDiv.append(searchErrorMessage); // אפנד לדיב שעליה ההודעה יושבת אחרת זה לא יופיע
            return; // מסיים בריטורן כי אם הואליו של השורת חיפוש ריק שהופנקציה תיעצר ולא תמשיך הלאה ללואת פור וכו
        };
        for (let index = 0; index < array100.length; index++) {
            const element = array100[index];
            if (searchValue == element.symbol) {
                cardDiv.innerHTML = "";
                drawCoins(element);
                return;
            };
        };
        cardDiv.innerHTML = "";
        const searchMessage = document.createElement("h3");
        searchMessage.innerHTML = "This coin not found";
        cardDiv.append(searchMessage);
    });

});

var i = 0;
function move() { // הבר הצהוב של טעינת המידע
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 10;
        var id = setInterval(frame, 10);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
                elem.innerHTML = width + "%";
            }
        }
    }
}

async function firstApi() {
    const firstBarDiv = document.createElement("div"); // יצירת דיבים של פרוגרס בר
    firstBarDiv.id = "myProgress";
    const secondBarDiv = document.createElement("div");
    secondBarDiv.id = "myBar";
    firstBarDiv.append(secondBarDiv)
    document.getElementById("cardDiv").append(firstBarDiv); // אפנד לדיב שבקובץ הדפדפן
    move() // קריאה לפונקציה שנמצאת למעלה שהיא מזיזה את הפרוגרס בר
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/list/");
        const jsonData = await response.json();
        array100 = jsonData.slice(0, 100);
        console.log(array100);
        for (let index = 0; index < array100.length; index++) { // לולאת פור על מנת להציג את כל האלמנטים (המטבעות) במערך
            const element = array100[index];
            drawCoins(element) // קריאה לפונקציה שמציירת את כל המטבעות (כל אלמנט)
        }
    }
    catch (error) {
        console.log(error, "Error");
    }
    finally {
        firstBarDiv.remove() // פיינלי כשהפאץ' מסתיים, אז שיסיר את הדיב של הפרוגרס בר כי אין טעם להשאיר אותו אחרי הטעינה
    }
}

function drawCoins(element) {
    const cardDiv = document.createElement("div"); // יצירת דיב שמציג את המטבעות עם קלאסים של בוטססטראפ
    cardDiv.classList.add("card");
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body");
    const moreDiv = document.createElement("div");
    moreDiv.classList.add("collapse");
    const cardH5 = document.createElement("h5");
    cardH5.classList.add("card-title");
    cardH5.innerText = element.symbol;
    const cardP = document.createElement("p");
    cardP.classList.add("card-text");
    cardP.innerText = element.name;
    const cardBtn = document.createElement("button"); // יצירת כפתור של MORE INFO
    cardBtn.classList.add("btn", "btn-primary");
    cardBtn.innerText = "More Info";
    let lastClicked = 0; // להגדיר מתי לחצתי בפעם האחרונה שיתחיל מאפס כדי לדעת אם ומאיפה למשוך את המידע
    cardBtn.addEventListener("click", () => {
        if (moreDiv.style.display == "none" || moreDiv.style.display == "") { // אם הדיב לא קיים או ריק תעשה שיופיע וההיפך
            moreDiv.style.display = "block";
            moreDiv.innerHTML = "";

            var timeNow = (new Date()).getTime(); // הגדרת זמן פונקציה קיימת בג'אווה סקריפט כי ביקשו לחכות 2 דקות עד לקבלת המידע

            if (timeNow > (lastClicked + 120000)) { // 120 שניות במיליסקנד
                console.log(" עברו")
                moreInfo(element.id, cardDiv, moreDiv) // הבדיקה אם עברו 2 דקות ואם כן אז קוראים שוב לאי-פי-איי
            }
            else {
                console.log("לא עברו")
                let data = JSON.parse(localStorage.getItem(element.id)); // אם לא עברו 2 דקות אז להוציא את המידע להלוקאל סטורג
                console.log(data)
                collapser(data, cardDiv, moreDiv) // ובנוסף קריאה לפונקציה שמציירת את המידע
            }

            lastClicked = timeNow;
            // בדיקה אם עברו יותר מ2 דקות מקריאת הAPI

        }
        else moreDiv.style.display = "none";
    });
    const toggleCard = document.createElement("label"); // יצירת טוגל בתוך הדיב של המטבע עם קלאסים לסי-אס-אס
    toggleCard.classList.add("switch");
    const inputCard = document.createElement("input");
    inputCard.type = "checkbox";
    inputCard.id = element.id;
    inputCard.addEventListener("change", () => { // לשנות את הטוגל אם הוא פועל או כבוי
        if (fiveCoinsArray.length === 5 && inputCard.checked) { // אם אורך המערך של המטבעות שנבחרו שווה ל5 והטוגל דולק
            openPopUp(fiveCoinsArray, element); // אז שיפעיל את הפונקציה של פתיחה החלון
        }
        if (inputCard.checked && fiveCoinsArray.length < 5) { // אם הטוגל דולק והמערך של החמישה מטבעות קטן מ5
            fiveCoinsArray.push(element); // תוסיף למערך את המטבע שנבחר (האלמנט)
        }
        else { // אם הטוגל לא דולק
            fiveCoinsArray = fiveCoinsArray.filter(item => { // עושים פילטר למערך כדי להסיר את המטבעות הכבויים
                return item.id !== element.id // מסירים מהמערך את המטבעות שיש להם את אותם אי-די כדי שיוסרו מהמערך גם לאחר שהמטבע כבה
            }); // ברגע שכיביתי את הטוגל אז הסרתי את הבחירה במטבע ולכן הוא מפולטר ויוצא מהמערך
        }
    })

    for (let coin of fiveCoinsArray) {
        if (coin.id == element.id) inputCard.checked = true; // אם המטבע נמצא במערך תפעיל לי את האינפוט
    }

    const cardSpan = document.createElement("span");
    cardSpan.classList.add("slider", "round"); // עיצוב של הטוגל
    cardBodyDiv.append(cardH5, cardP, cardBtn);
    toggleCard.append(inputCard, cardSpan);
    cardDiv.append(cardBodyDiv, toggleCard);
    document.getElementById("cardDiv").append(cardDiv);
}

async function moreInfo(id, cardDiv, moreDiv) { // הבאת המידע מהאי-פי-איי לפי האי-די של המטבע
    const firstBarDiv = document.createElement("div");
    firstBarDiv.id = "myProgress";
    const secondBarDiv = document.createElement("div");
    secondBarDiv.id = "myBar";
    firstBarDiv.append(secondBarDiv)
    cardDiv.append(firstBarDiv);
    move()
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const moreInfoData = await response.json();
        console.log(moreInfoData);
        localStorage.setItem(id, JSON.stringify(moreInfoData));
        collapser(moreInfoData, cardDiv, moreDiv);

    }
    catch (error) {
        console.log(error, "Error");
    }
    finally {
        firstBarDiv.remove()
    }
}

function collapser(moreInfoData, cardDiv, moreDiv) {
    const secondDiv = document.createElement("div"); // יצירת דיב ליצירת חלון של עוד מידע להצגת תמונת מטבע ומחירו במטבעות השונים
    secondDiv.classList.add("card", "card-body", "more-info");
    const moreInfoImg = document.createElement("img");
    moreInfoImg.src = moreInfoData.image.large;
    moreInfoImg.classList.add("more-info-img");
    const dollarMoreInfo = document.createElement("p");
    dollarMoreInfo.innerText = moreInfoData.market_data.current_price.usd + "$"
    const euroMoreInfo = document.createElement("p");
    euroMoreInfo.innerText = moreInfoData.market_data.current_price.eur + "€";
    const shekelMoreInfo = document.createElement("p");
    shekelMoreInfo.innerText = moreInfoData.market_data.current_price.ils + "₪";
    secondDiv.append(moreInfoImg, dollarMoreInfo, euroMoreInfo, shekelMoreInfo);
    moreDiv.append(secondDiv);
    cardDiv.append(moreDiv);
}

function openPopUp(array, sixElement) { // יצירת חלון חדש לאחר בחירה בשישה מטבעות
    const popUpDiv = document.createElement("div");
    popUpDiv.classList.add("popUp")
    const popUpTitle = document.createElement("h3");
    popUpTitle.innerText = "You Can Choose Only 5 Coins";
    popUpTitle.className = "popUpTitle";
    popUpDiv.append(popUpTitle);
    const div = document.getElementById("popUpDiv");
    for (let index = 0; index < array.length; index++) { // עוברים על המערך של החמישה מטבעות שנבחרו
        const element = array[index];
        const coinsDiv = document.createElement("div");
        coinsDiv.classList.add("coinsDiv");
        const coinsh5 = document.createElement("h5");
        coinsh5.innerText = element.name;
        const coins3symbol = document.createElement("p");
        coins3symbol.innerText = element.symbol;
        const toggleCard = document.createElement("label");
        toggleCard.classList.add("switch", "toggle");
        const inputCard = document.createElement("input");
        inputCard.type = "checkbox"; // האינפוט של המטבעות שנבחרו שיהיו מהסוג צק בוקס
        inputCard.checked = true; // שהמטבעות שנבחרו יהיו מופעלים
        inputCard.addEventListener("change", () => {
            if (inputCard.checked == false) { // אם האינפוט של המטבע כבוי
                fiveCoinsArray = array.filter(item => item !== element); // תסיר לי את המטבע שלא נבחר מהמערך
                fiveCoinsArray.push(sixElement); // ותוסיף על חשבונו את המטבע השישי שנבחר
                popUpDiv.remove(); // שהדיב שנפתח יוסר 
                div.style.display = "none";// את הפופ אפ לסגור כי אין צורך בו עם חמישה מטבעות
                document.getElementById(element.id).checked = false; // המטבע שהוסר יכובה מהאינפוט שלו גם בדיב הראשי
            }
        });

        const cardSpan = document.createElement("span"); // הטוגל של הבחירת מטבעות ואז יועצב בסי-אס-אס
        cardSpan.classList.add("slider", "round");
        toggleCard.append(inputCard, cardSpan);
        coinsDiv.append(coinsh5, coins3symbol, toggleCard);
        popUpDiv.append(coinsDiv);
    }

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel Last Coin";
    cancelBtn.className = "button-45";
    cancelBtn.addEventListener("click", () => {
        document.getElementById(sixElement.id).checked = false; // אם המטבע השישי הוסר על ידי לחיצת הכפתור
        popUpDiv.remove(); // שהדיב של הפופאפ יוסר
        div.style.display = "none"; // ולא יוצג
    })
    popUpDiv.append(cancelBtn);
    div.style.display = "block";
    div.append(popUpDiv);
};

function openAbout() { // קורא לפונקציה מווינדוס און לואד - קליק אחרי לחיצה על הכפתור אודות
    const cardDiv = document.getElementById("cardDiv"); // מביא את המשתנה של הדיב מהדפדפן
    cardDiv.innerHTML = ""; // מנקה את התוכן של הדיב
    const aboutDiv = document.createElement("div");
    aboutDiv.id = "aboutDiv";
    const myName = document.createElement("h1");
    myName.innerHTML = "Tamir Saadi";
    const myDetails = document.createElement("h5");
    myDetails.innerHTML = "Hey! I'm Tamir, 29 years old from Kiryat-Ono, Israel. I'm a full-stack web developer student at John Bryce College, here is my second-course project.";
    const projectDescription = document.createElement("div");
    projectDescription.innerHTML = `<p>The world of virtual trading has become very popular in recent years.</p>
    <p>Various APIs have been created that provide free information about the state of currencies, prices, history, buying and selling, and more. The application that I built is a client-side application that contains calls to various APIs.</p>
    <p>All the information is stored solely on the client side, there is no information that requires storage on the backend or database. In this project, I implement the following topics:</p>
    <p>(In this project, I implement the following topics:</p>
    <br>
    <p>HTML + CSS</p>
    <p>New HTML5 tags</p>
    <p>CSS3 media queries and advanced selectors</p>
    <p>Dynamic page layouts</p>
    <p>Bootstrap & flex</p>
    <br>
    <p>JavaScript</p>
    <p>Objects</p>
    <p>Callbacks, Promises, Async Await</p>
    <p>Single Page Application foundations</p>
    <p>Events</p>
    <p>Ajax (RESTful API)</p>
    <p>Documentation</p>
    <p>External APIs</p>`;

    const myImage = document.createElement("img");
    myImage.id = "myImage"; //אם ארצה לערוך ב CSS
    myImage.src = "./myImage.jpeg";
    aboutDiv.append(myName, myDetails, projectDescription, myImage);
    cardDiv.append(aboutDiv);
};

async function openLiveReports() {
    console.log(fiveCoinsArray)
    const myChart = document.getElementById("myChart"); // מביאים את הקנבאס מהדפדפן
    if (fiveCoinsArray.length == 0) {
        myChart.style.display = "none";
        const cardDiv = document.getElementById("cardDiv");
        cardDiv.innerHTML = "Please Choose At Least One Coin To Live Report";
        return
    }
    myChart.style.display = "block"; // דיספליי בלוק שנראה אותו רק אחרי הלחיצה בקליק בנאב בר הרלוונטי

    let string = ""; // יצרתי שם משתנה עם סטרינג ריק כדי להוסיף אליו את הסימבולים של המטבעות מהמערך
    for (let index = 0; index < fiveCoinsArray.length; index++) { // לולאת פור על המערך של החמישה מטבעות, משתנה גלובלי בהתחלה
        const element = fiveCoinsArray[index]; // כדי לעבור על כל מטבע (אלמנט) מהמערך הנבחר
        string += element.symbol + ","; // הוספנו לסטרינג הריק את הסימבול של המטבע פלוס פסיק כדי להוסיף ולהפריד את המטבעות בשורת הכתובת לדפדפן
        console.log(string)
    }

    let dataSet = []; // יצרתי מערך ריק כדי להוסיף אליו את האובייקטים לפי כמות המטבעות ולהכניס אותם לגרף (מערך של קי)
    const colors = ["red", "green", "yellow", "blue", "black"]; // מערך של צבעים כדי לתת לכל מטבע צבע ייחודי
    let data2 = []; // יצרתי מערך ריק כדי להוסיף אליו את המערך של הואליו של המטבע שזה המחיר שלו בדולרים (מערך של ואליו)
    try {
        const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${string}&tsyms=USD`) // סטרינג שם משתנה במקום שם קוד מטבע של שלושה אותיות פסיק וקוד נוסף
        const data = await response.json();
        console.log(data); // דאטה זה אובייקט עם החמישה מטבעות והערכים שלו (המחיר בדולרים)
        const keys = Object.keys(data) // מביא את הסימבול של החמש מטבעות ב3 ספרות כמערך
        for (let i = 0; i < keys.length; i++) { // לולאת פור על המערך של הסימבול של המטבעות 
            data2.push([]); // פוש למערך ריק ראשוני בפעם הראשונה
            let value = data[keys[i]].USD; // מביאים את הערך של האובייקט שזה המחיר בדולרים
            console.log(value)
            data2[i].push(value); // מוסיפים למערך את המחיר בדולרים כדי שיוצג על הגרף
            let object = { // יצרתי אובייקט שכל אחד ממנו הוא מטבע שמוצג על הגרף
                data: data2[i],
                borderColor: colors[i],
                label: keys[i],
                fill: false
            }
            dataSet.push(object); // פוש למערך של כל המידע שמוצג על הגרף כמו צבע הקו בגרף, ומידע על פי אינדקס במערך
        }

    } catch (error) {
        console.log("Error", error);
    }

    let xArray = [new Date().getMinutes() + ":" + new Date().getSeconds()]; //  ציר האיקס שדרך פונקציה של ג'אווה סקריפט מגיעים לדקה פלוס השניה הנוכחית

    new Chart("myChart", { // יוצר לי את הגרף בפעם הראשונה
        type: "line",
        data: {
            labels: xArray, //  -בשורה 264 מכניס לציר האיקס את הערכים שיצרתי קודם
            datasets: dataSet
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Current Time"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Coin Value"
                }
            }
        }
    });

    // הועתק פעם נוספת כדי שיופיע כל 2 שניות מההתחלה ולא רק אחרי 2 שניות

    interval = setInterval(async () => {
        dataSet = []; // מערך ריק של אובייקט שמתנקה בסוף הפונקציה כל 2 שניות
        try {
            const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${string}&tsyms=USD`) // סטרינג שם משתנה במקום שם קוד מטבע של שלושה אותיות פסיק וקוד נוסף
            const data = await response.json();
            console.log(data);
            const keys = Object.keys(data)
            for (let i = 0; i < keys.length; i++) {
                let value = data[keys[i]].USD;
                console.log(value)
                data2[i].push(value);
                if (data2[i].length == 11) { // כדי שהגרף לא ימשך לנצח עוצרים אותו בהצגה ה11 כדי שיציג על הגרף רק 10 פעמים
                    data2[i].splice(0, 1);
                }
                let object = {
                    data: data2[i], // מערך של המחיר של כל מטבע בכל אינדקס (יש 10 פעמים)
                    borderColor: colors[i],
                    label: keys[i],
                    fill: false
                }
                dataSet.push(object); // מוסיפים אובייקט למערך
            }
            // console.log(dataSet);
            // מערך שכולל את כל האלמנטים באובייקט כמו מחיר, צבע על הגרף וכו

        } catch (error) {
            console.log("Error", error);
        }
        // מוסיפים למערך פוש של ציר האיקס כל 2 שניות (הקפיצות לייב בגרף)
        xArray.push(new Date().getMinutes() + ":" + new Date().getSeconds());
        if (xArray.length == 11) {
            xArray.splice(0, 1);
        }
        new Chart("myChart", {
            type: "line",
            data: {
                labels: xArray,
                datasets: dataSet // הדאטה סט שעושים לו פוש לאובייקט בשורה 320
            },
            options: {
                legend: { display: true } // מציגים את הסמל והצבע של המטבע
            }
        });
    }, 2000) // שתי שניות במיליסקנד
};