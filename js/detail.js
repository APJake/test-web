const detailContainer = document.querySelector('.detail-main .container');
const dataContainer = document.querySelector('.detail-main .container .data');
const circleProgress = document.querySelector('.detail-main .container .detail .data-ui .data-box svg circle:nth-child(2)');
const loadingContainer = document.querySelector('.loading-container');
const percentText = document.querySelector('.detail-main .container .detail .data-ui .data-box .percent .number p');

const dataMultiple = document.querySelector('.detail-main .container .detail .data-ui.multiple');

const textName = document.querySelector('.detail-main .container .detail h2');
const textRoll = document.querySelector('.detail-main .container .detail h6');

const textUserPoint = document.getElementById('user-points');
const textTotalPoint = document.getElementById('total-points');

const svgCrown = document.querySelector('.detail-main .container .detail .data-ui .data-box .crown');

let skip_column = 2;

let total_points = 0;
let user_points = 0;

giveOffset = (percent) => {
    return 440 - (440 * percent) / 100;
}

changePercent = (textEle, circleEle) => {
    let percent = user_points / total_points * 100;
    if (isNaN(percent)) percent = 0;
    textEle.innerHTML = percent + '<span>%</span>';
    circleEle.style.strokeDashoffset = giveOffset(percent);
    textUserPoint.innerHTML = user_points;
    textTotalPoint.innerHTML = total_points;
    if (percent >= 80) {
        svgCrown.setAttribute('class', 'crown show');
    }
}

initUI = () => {
    hideMe(detailContainer);
};

initUI();

openUi = () => {
    showMe(detailContainer);
    hideMe(loadingContainer);
}

createCircle = (percent, title) => {
    let div = document.createElement('div');
    div.className = 'data-box';
    let h3 = document.createElement('h3');
    h3.innerHTML = title;
    div.appendChild(h3);
    let div_percent = document.createElement('div');
    div_percent.className = 'percent';
    let svg = document.createElement('svg');

    let circle1 = document.createElement('circle');
    circle1.setAttribute('cx', '70');
    circle1.setAttribute('cy', '70');
    circle1.setAttribute('r', '70');

    let circle2 = document.createElement('circle');
    circle2.setAttribute('cx', '70');
    circle2.setAttribute('cy', '70');
    circle2.setAttribute('r', '70');

    svg.appendChild(circle1);
    svg.appendChild(circle2);

    let div_number = document.createElement('div');
    div_number.className = 'number';
    div_number.innerHTML = '<p>' + percent + '<span>%</span></p>';
    div_percent.appendChild(svg);
    div_percent.appendChild(div_number);

    div.appendChild(div_percent);
    return div;
}

calcPercent = (a, b) => {
    return a / b * 100;
}

try {
    let roll = getParameter('roll');
    console.log(roll);
    if (hasInStorage(roll)) {
        const entry = getJson(roll);
        // clearStorage();
        if (entry == null) throw 'Empty Entry';
        textRoll.innerHTML = roll;
        textName.innerHTML = entry.gsx$facebookname.$t;
        let tableHeading = "<table><tr><th>Weeks</th><th>Points</th></tr>";
        let tableBody = "";
        for (const key in entry) {
            if (key.startsWith('gsx$')) {
                if (skip_column-- > 0) {
                    continue;
                }
                let readableKey = key.substr(4);
                let pointStr = entry[key].$t;
                let arr = pointStr.split(' / ');
                let point = parseInt(arr[0]);
                let total = parseInt(arr[1]);
                user_points += point;
                total_points += total;
                tableBody += "<tr><td>" + readableKey + "</td><td>" + pointStr + "</td></tr>";
            }
        }
        if (isNaN(total_points)) {
            total_points = 0;
        }

        openUi();

        changePercent(percentText, circleProgress);
        dataContainer.innerHTML = tableHeading + tableBody + "</table>";
    } else {
        throw 'No Such Data';
    }
} catch (error) {
    console.log(error);
    // window.history.back();
}