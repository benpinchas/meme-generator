let gMeme = {}

function createTexts() {
    if (!gMeme.txts) {
        gMeme.txts = [
            createText('heloo first', 50, { x: 10, y: 100 }, '#d64074'),
            createText('sfqwdew ', 27, { x: 10, y: 200 }, '#0084ff'),
            createText(' by by by', 25, { x: 10, y: 270 }, '#006b31')
        ]
    }
}

function addText(line, size, pos,color) {
    let newText = createText(line, size, pos, color);
    gMeme.txts.push(newText);
}

function createText(line='Add Text', size=25, pos={x: 100, y: 100}, color='#000000') {
    let outline = calcOutline(line, size);
    // pos.y = pos.y - outline.height  //mark   
    return { line, size, pos, color, outline };
}



function calcOutline(line, size) {
    let el = document.querySelector('#sizing');
    el.innerText = line;
    el.style.fontSize = size + 'px';
    // hi
    return { width: el.clientWidth , height: el.clientHeight }
}


function updateText(text, line) {
    text.line = line
}

function updateOutline(text) {
    // console.log('updating outline:', text);
    text.outline = calcOutline(text.line, text.size)
}

function getTexts() {
    return gMeme.txts;
}



function updatePos(text ,pos) {
    text.pos = pos;
}

function deleteText(text) {
    let textIdx = gMeme.txts.findIndex(textObj => {
        return textObj === text;
    })
    gMeme.txts.splice(textIdx, 1)
}

function setTextProps(text, color, size) {
    console.log('setTextProps');
    text.color = color;
    text.size = size;
    text.outline = calcOutline(text.line, size)
}
function getImgSrc() {
    return gMeme.imgSrc;
}
function updateImgSrc(imgSrc) {
    gMeme.imgSrc = imgSrc;
}