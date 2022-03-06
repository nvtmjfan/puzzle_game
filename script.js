let sWidth = 1;
let sHeight = 1;

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
    sWidth = Math.round(blah_real.width / +row.value);
    sHeight = Math.round(blah_real.height / +column.value);
    let canvasList = pieces.getElementsByTagName("canvas");
    while (canvasList && canvasList.length > 0) {
        pieces.removeChild(canvasList[0]);
    }
    tableMain.innerHTML = '';
    let sx = 0;
    let sy = 0;
    canvasList = [];
    let dSize = calDsize();
    for (let i = 0; i < row.value; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < column.value; j++) {
            let canvas = document.createElement("canvas");
            canvas.id = 'id' + (new Date()).getTime() + '_' +
                Math.random().toString(16).slice(2);
            canvas.width = sWidth;
            canvas.height = sHeight;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(blah, sx, sy, sWidth, sHeight, 0, 0, dSize.width, dSize.height);
            canvasList.push(canvas);

            canvas.draggable = true;
            canvas.ondragstart = drag;

            sy += sHeight;

            let td = document.createElement("td");
            td.ondrop = drop;
            td.ondragover = allowDrop;
            td.style.width = dSize.width + 'px';
            td.style.height = dSize.height + 1 + 'px';
            tr.appendChild(td);
        }
        sx += sWidth;
        sy = 0;
        tableMain.appendChild(tr);
    }

    while (canvasList && canvasList.length > 0) {
        let index = Math.round(Math.random() * 10);
        if (index >= canvasList.length) continue;
        pieces.appendChild(canvasList[index]);
        canvasList.splice(index, 1);
    }
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
}

function calDsize() {
    let maxWidth = pieces.offsetWidth - 10;
    if (sWidth <= maxWidth) {
        return { width: sWidth, height: sHeight };
    }
    let rate = maxWidth / sWidth;
    return { width: maxWidth, height: sHeight * rate };
}