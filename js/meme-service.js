let gMeme = {}

function createTexts(canvasWidth=800, canvasHeight=600) {
    let col = canvasWidth/10
    let row = canvasHeight/10
    if (!gMeme.txts) {
        gMeme.txts = [
            createText('WELCOME', canvasWidth/16, { x: 0, y: row }, '#ffffff',getId()),
            createText('One click to edit', canvasWidth/13, { x: col, y: row*4}, '#0084ff',getId()),
            createText('Drag Me', canvasWidth/20, { x: col*2, y: row*7}, '#006b31','4')
        ]
    }
}

function addText(line, size, pos,color, id) {
    let newText = createText(line, size, pos, color, id);
    gMeme.txts.push(newText);
}

function createText(line='Add Text', size=45, pos={x: 100, y: 100}, color='#ffffff',id=getId()) {
    let outline = calcOutline(line, size);
    return { line, size, pos, color, id, outline};
}



function calcOutline(line, size) {
    let el = document.querySelector('#sizing');
    el.innerText = line;
    el.style.fontSize = size + 'px';
    // hi
    return { width: el.clientWidth , height: el.clientHeight }
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



function getTextById(id) {
    return gMeme.txts.find(text => {
        return text.id === id;
    })
}

function updateTextContent(textObj, line) {
    textObj.line = line
}




//UTIL
function getId() {
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ID_LENGTH = 5;
    var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}
