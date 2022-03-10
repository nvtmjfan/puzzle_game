let sWidth = 1;
let sHeight = 1;

let timer;
let seconds = 0;
let seconds_100 = 0;
let minutes = 0;
let hours = 0;

let result = [];

function bodyOnload() {
    imgInp.onchange = evt => {
        const [file] = imgInp.files
        if (file) {
            let url = URL.createObjectURL(file);
            blah.src = url;
            blah_real.src = url;
            fileName.innerHTML = file.name;
        }
    }
}

function start() {
    you_win.setAttribute('class', 'd-none');
    not_exactly.setAttribute('class', 'd-none');
    const rowI = +row.value;
    const colI = +column.value;
    if (rowI * colI > 2500) {
        alert('Row * column need <= 2500.');
        return;
    }
    sWidth = blah_real.width / colI;
    sHeight = blah_real.height / rowI;
    let canvasList = pieces.getElementsByTagName("canvas");
    while (canvasList && canvasList.length > 0) {
        pieces.removeChild(canvasList[0]);
    }
    tableMain.innerHTML = '';
    let sx = 0;
    let sy = 0;
    canvasList = [];
    let dSize = calDsize();
    const tdWidth = dSize.width + 'px';
    const tdHeight = dSize.height + 'px';
    let tdLeft = 0;
    let tdTop = 0;
    result = [];
    for (let i = 0; i < rowI; i++) {
        for (let j = 0; j < colI; j++) {
            let canvas = document.createElement("canvas");
            canvas.width = dSize.width;
            canvas.height = dSize.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(blah, sx, sy, sWidth, sHeight, 0, 0, dSize.width, dSize.height);
            canvasList.push(canvas);

            canvas.draggable = true;
            canvas.ondragstart = drag;

            let td = document.createElement("div");
            td.ondrop = drop;
            td.ondragover = allowDrop;
            td.style.width = tdWidth;
            td.style.height = tdHeight;
            td.style.left = tdLeft + 'px';
            td.style.top = tdTop + 'px';
            sx += sWidth;
            tdLeft += dSize.width;
            tableMain.appendChild(td);

            let id = 'id' + Math.random().toString(16).slice(2);
            canvas.id = id;
            result.push(id);
        }

        sy += sHeight;
        tdTop += dSize.height;
        sx = 0;
        tdLeft = 0;
    }

    while (canvasList && canvasList.length > 0) {
        let index = Math.round(Math.random() * 10);
        if (index >= canvasList.length) continue;
        pieces.appendChild(canvasList[index]);
        canvasList.splice(index, 1);
    }

    seconds_100 = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timer = setInterval(() => {
        seconds_100++;
        if (seconds_100 == 100) {
            seconds_100 = 0;
            seconds++;
        }
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
        element_time.innerHTML = `${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s:<small>${seconds_100.toString().padStart(2, '0')}</small>`
    }, 10);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let el = ev.target;
    if (el.tagName == 'CANVAS') el = el.parentNode;
    if (el != pieces && el.firstChild) {
        pieces.appendChild(el.firstChild);
    }
    let data = ev.dataTransfer.getData("text");
    el.appendChild(document.getElementById(data));
    setTimeout(() => checkResult());
}

function calDsize() {
    if (blah_real.width <= blah.offsetWidth) {
        return { width: sWidth, height: sHeight };
    }
    let rate = blah.offsetWidth / blah_real.width;
    return { width: Math.round(sWidth * rate), height: Math.round(sHeight * rate) };
}

function checkResult() {
    not_exactly.style.display = 'none';
    you_win.style.display = 'none';
    let canvasList = tableMain.getElementsByTagName("canvas");
    if (!canvasList || canvasList.length <= 0) {
        return;
    }
    const len = canvasList.length;
    if (+row.value * +column.value != len) return;
    for (let i = 0; i < len; i++) {
        if (result[i] != canvasList[i].id) {
            not_exactly.setAttribute('class', '');
            not_exactly.style.display = 'block';
            return;
        }
    }
    clearInterval(timer);
    not_exactly.setAttribute('class', 'd-none');
    you_win.setAttribute('class', '');
    you_win.style.display = 'block';
}

function changeImage(event) {
    blah.src = event.target.value;
    blah_real.src = event.target.value;
}