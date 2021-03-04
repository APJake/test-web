let section = document.querySelector('.my-results section');
let outerText = document.querySelector('.my-results .outerText');
let innerText = document.querySelector('.my-results .innerText');

window.addEventListener('scroll', function() {
    let value = window.scrollY;
    section.style.clipPath = 'circle(' + value + 'px at center center)';
    // outerText.style.left = 100 - value / 5 + '%';
    // innerText.style.left = 100 - value / 5 + '%';
});

let container = document.querySelector('.my-results .container');
let resultDiv = document.querySelector('.my-results .container .results');
let resultsTitle = document.querySelector('.my-results .container h2');
let resultsDesc = document.querySelector('.my-results .container p');
// let btnSearch = document.querySelector('.my-results .container .btn');
let loadingTitle = document.querySelector('.my-results .loading-title');
let imgArrow = document.querySelector('.my-results img');
let loadingContainer = document.querySelector('.loading-container');
// Search
const inputSearch = document.querySelector('.my-results .search-box .search');
const btnSearch = document.querySelector('.my-results .search-box .btn');

hideMe(imgArrow);
hideMe(container);

let strLastKey = "";
let results = [];

searchMe = (value, entries) => {

    value = value.toUpperCase();

    if (value != '') {
        results = [];
        for (const key in entries) {
            const entry = entries[key];
            const roll = entry.gsx$rollno.$t;
            if (roll.includes(value)) {
                results.push(entry);
            }
        }
    } else results = entries;

    let opening = "<table><tr><th>Roll No</th><th>FB Name</th><th>" + strLastKey + "</th></tr>";
    let body = '';
    for (let key in results) {
        const row = results[key];
        body += '<tr><td><a href="#" onclick="goThere(\'' + key + '\')">' + row.gsx$rollno.$t + '</a></td><td><a href="#" onclick="goThere(\'' + key + '\')">' + row.gsx$facebookname.$t + '</a></td><td>' + row['gsx$' + strLastKey]['$t'] + '</td></tr>';
        // body += '<tr><td><a href="./detail.html?roll=' + roll + '">' + roll + '</a></td><td><a href="./detail.html?roll=' + roll + '">' + name + '</a></td></tr>';
    }
    resultDiv.innerHTML = opening + body + '</table>';
}

goThere = (key) => {
    let entry = results[key];
    const roll = entry.gsx$rollno.$t;
    const url = './detail.html?roll=' + roll;
    setJson(roll, entry);
    window.location.href = url;
}


fetch(RESULTS_URL)
    .then(res => res.json())
    .then(data => {
        const data_row = data.feed.entry;


        let eleTable = document.createElement('table');
        eleTable.border = 1;

        let titles = "";
        let strRows = "";
        for (const row of data_row) {
            if (strLastKey == '') {
                for (const key in row) {
                    if (key.startsWith('gsx$')) {
                        strLastKey = key.substr(4);
                    }
                }
            }
            // strRows += '<tr><td><a href="./detail.html?roll=' + row.gsx$rollno.$t + '">' + row.gsx$rollno.$t + '</a></td><td><a href="./detail.html?roll=' + row.gsx$rollno.$t + '">' + row.gsx$facebookname.$t + '</a></td><td>' + row['gsx$' + strLastKey]['$t'] + '</td></tr>';
        }

        searchMe('', data_row);

        inputSearch.addEventListener('keyup', () => {
            let value = inputSearch.value.trim();
            searchMe(value, data_row);
        });
        btnSearch.addEventListener('onClick', () => {
            let value = inputSearch.value.trim();
            searchMe(value, data_row);
        });

        // titles = "<tr><th>Roll No</th><th>FB Name</th><th>" + strLastKey + "</th></tr>";
        // eleTable.innerHTML = titles + strRows;
        // resultsDiv.appendChild(eleTable);

        // do UI
        hideMe(loadingContainer);
        loadingTitle.innerHTML = TEXT_SCROLL_DOWN;
        resultsTitle.innerHTML = "Here is Results";
        resultsDesc.innerHTML = TEXT_CLICK_YOUR_NAME_FOR_DETAIL;
        // btnSearch.innerHTML = TEXT_SEARCH_BY_ROLL;
        showMe(imgArrow);
        showMe(container);
    })
    .catch(err => {
        loadingTitle.innerHTML = 'Something went wrong';
        hideMe(loadingContainer);
    });

//new


// fetch(RESULTS_URL)
//     .then(res => res.json())
//     .then(json => {

//         afterUI();

//         const entries = json.feed.entry;

//         inputSearch.addEventListener('keyup', () => {
//             let value = inputSearch.value.trim();
//             searchMe(value, entries);
//         });
//         btnSearch.addEventListener('onClick', () => {
//             let value = inputSearch.value.trim();
//             searchMe(value, entries);
//         });

//     })
//     .catch(err => {
//         resultDiv.innerHTML = '<p class="error">Something Went Wrong. Try Refresh the page<br>(or)<br>Contact to LogixOwl</p>';
//     });