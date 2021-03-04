convertToHTML = (markdown) => {
    return markdown.split('/\r?\n/');
}

hideMe = element => {
    element.style = 'display: none;';
}

getStorage = (key) => {
    return localStorage.getItem(key);
}

clearStorage = () => {
    localStorage.clear();
}

hasInStorage = key => {
    return localStorage.getItem(key) != null;
}

setStorage = (key, value) => {
    localStorage.setItem(key, value);
}

showMe = element => {
    element.style = '';
}

htmlEncode = (s) => {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

getJson = key => {
    return JSON.parse(getStorage(key));
}

setJson = (key, value) => {
    setStorage(key, JSON.stringify(value));
}

checkParameter = parameter => {
    if (!parameter) return false;
    var letterNumber = /^[0-9a-zA-Z_./-]+$/;
    if (parameter.match(letterNumber)) return true;
    else return false;
}

getParaURL = () => {
    var url = new URL(window.location.href);
    var url = url.searchParams.get('url');
    if (!checkParameter(url)) return null;
    return url.toString().trim();
}

getParameter = (para) => {
    var url = new URL(window.location.href);
    var url = url.searchParams.get(para);
    if (!checkParameter(url)) return null;
    return url.toString().trim();
}

copyToClickboard = element => {
    /* Get the text field */
    var copyText = element;

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");
}

changeZawgyi = text => {
    const converter = new google_myanmar_tools.ZawgyiConverter();
    return converter.unicodeToZawgyi(text);
}

changeUnicode = text => {
    const converter = new google_myanmar_tools.ZawgyiConverter();
    return converter.zawgyiToUnicode(text);
}

makeHTML = (text) => {
    text = text.toString().trim();
    if (text == '') return;

    let lines = text.split('\n');
    let newText = '';
    let linesLength = lines.length;
    let counter = 0;
    let isInPre = false;

    while (counter < linesLength) {
        let line = lines[counter].trim();
        if (line == '') {
            counter++;
            continue;
        }
        let isPreDef = false;
        line = htmlEncode(line);

        if (line.startsWith('| ') &&
            ((lines[counter].startsWith('| --- |')) ||
                (counter < linesLength - 1 &&
                    lines[counter + 1].startsWith('| --- |')))) {

            let tmp = '<div class="responsive-table"><table border="1">';
            let openb = '<th>';
            let closeb = '</th>';
            while (line.startsWith('| ')) {
                if (line.startsWith('| --- |')) {
                    counter++;
                    line = lines[counter];
                    continue;
                }
                let columns = line.split('|');
                tmp += '<tr>';
                for (let i = 1; i < columns.length - 1; i++) {
                    col = columns[i].trim();
                    tmp += openb + col + closeb;
                }
                tmp += '</tr>';
                openb = '<td>';
                closeb = '</td>';
                counter++;
                line = lines[counter];
            }
            tmp += '</table></div>';
            line = tmp;
        }
        // h1 to 6
        if (!isInPre && (line.match(/^#{1,6}\s/) || line.match(/^&gt;\s*?#{1,6}\s/))) {
            isPreDef = true;
            let newLine = '';
            if (line.startsWith('>')) {
                newLine = '<p class="highlight">';
            }
            if (line.match(/^.*#{6}\s(.*)/)) newLine += '<h6>' + line.match(/^.*#{6}\s(.*)/)[1] + '</h6>';
            else if (line.match(/^.*#{5}\s(.*)/)) newLine += '<h5>' + line.match(/^.*#{5}\s(.*)/)[1] + '</h5>';
            else if (line.match(/^.*#{4}\s(.*)/)) newLine += '<h4>' + line.match(/^.*#{4}\s(.*)/)[1] + '</h4>';
            else if (line.match(/^.*#{3}\s(.*)/)) newLine += '<h3>' + line.match(/^.*#{3}\s(.*)/)[1] + '</h3>';
            else if (line.match(/^.*#{2}\s(.*)/)) newLine += '<h2>' + line.match(/^.*#{2}\s(.*)/)[1] + '</h2>';
            else if (line.match(/^.*#{1}\s(.*)/)) newLine += '<h1>' + line.match(/^.*#{1}\s(.*)/)[1] + '</h1>';
            line = newLine;
        }
        // highlight
        if (!isInPre && line.startsWith('&gt;')) {
            line = '<p class="highlight">' + line.substr(4) + '</p>';
        }
        // code
        if (line.includes('```')) {
            let newLine = '';
            let reg = new RegExp(/```.*?```/, 'g');
            if (line.match(reg) && !isInPre) {
                let splitted = line.split(reg);
                newLine = splitted[0];
                let matches = Array.from(line.matchAll(reg), x => x[0]);
                for (let i = 0; i < matches.length; i++) {
                    match = matches[i];
                    newLine += '<span>' + match.substring(3, match.length - 3) + '</span>' + splitted[i + 1];
                }
                line = newLine;
            } else {
                if (isInPre) {
                    if (line.match(/^```/)) {
                        line = line.replace('```', '</pre></div>');
                        isInPre = false;
                    }
                } else {
                    if (!isPreDef) {
                        isInPre = true;
                        let language = line.match(/```.*/)[0].substr(3);
                        line = line.replace(/```.*/, '<div class="pre"><pre class="' + language + '">');
                    }
                }
            }
        }
        // link a href
        let url_pattern = /\[.*?\]\(.*?\)/;
        if (line.match(url_pattern) && !isInPre) {
            let reg = new RegExp(url_pattern, 'g');
            let arr = line.split(url_pattern);
            let newLine = arr[0];
            let urls = Array.from(line.matchAll(reg), x => x[0]);
            for (let i = 0; i < urls.length; i++) {
                let url = urls[i];
                let hrefStr = url.substring(url.lastIndexOf('(') + 1, url.length - 1);
                let innerStr = url.substr(1, url.indexOf(']') - 1);
                let tmp = '<a href="' + hrefStr + '">' + innerStr + '</a>';
                if (hrefStr.trim().startsWith('./')) {
                    tmp = '<a href="?url=./files/' + hrefStr + '">' + innerStr + '</a>';
                }
                newLine += tmp + arr[i + 1];
            }
            line = newLine;
        }
        // bold, italic
        if (line.match(/\*[^\*\s](.*?)\S\*/)) {
            //bold
            let newLine = '';
            let reg = new RegExp(/\*\*[^\*\s].*?\S\*\*/, 'g');
            if (line.match(reg)) {
                let arr = line.split(reg);
                newLine += arr[0];
                let matches = Array.from(line.matchAll(reg));
                for (let i = 0; i < matches.length; i++) {
                    let match = matches[i];
                    newLine += '<b>' + match[0].substring(2, match[0].length - 2) + '</b>' + arr[i + 1];
                }
                line = newLine;
            }
            reg = new RegExp(/\*[^\*\s].*?\S\*/, 'g');
            let arr = line.split(reg);
            newLine = arr[0];
            let matches = Array.from(line.matchAll(reg));
            for (let i = 0; i < matches.length; i++) {
                let match = matches[i];
                newLine += '<i>' + match[0].substring(1, match[0].length - 1) + '</i>' + arr[i + 1];
            }
            line = newLine;
        }
        // html
        if (line.startsWith('&lt;') && !isInPre) {
            line = line.replaceAll('&gt;', '>').replaceAll('&lt;', '<');
        }
        // newLine
        if (isInPre) {
            line = '\n' + line;
        }


        newText += line;
        counter++;
    }
    return newText;
}