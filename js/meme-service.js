let gMeme = {}

function createTexts() {
    if (!gMeme.txts) {
        gMeme.txts = [
            createText('WELCOME', 50, { x: 10, y: 60 }, '#ffffff','1'),
            createText('One click to edit', 37, { x: 20, y: 160 }, '#ffffff','2'),
            createText('Double Click To Write', 64, { x: 10, y: 210 }, '#0084ff','3'),
            createText('Drag Me', 44, { x: 10, y: 370 }, '#006b31','4')
        ]
    }
}

function addText(line, size, pos,color, id) {
    let newText = createText(line, size, pos, color, id);
    gMeme.txts.push(newText);
}

function createText(line='Add Text', size=25, pos={x: 100, y: 100}, color='#000000',id) {
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
