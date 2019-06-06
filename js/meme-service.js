let gMeme = {}

function createTexts() {
    if (!gMeme.txts) {
        gMeme.txts = [
            createText('heloo first', 50, { x: 10, y: 100 }, '#d64074'),
            createText('sfqwdew ', 10, { x: 10, y: 200 }, '#f7ff00'),
            createText(' by by by', 25, { x: 10, y: 270 }, '#006b31')
        ]
    }
}

function addText(line, size, pos,color) {
    let newText = createText(line, size, pos, color);
    gMeme.txts.push(newText);
}

function createText(line, size, pos, color) {
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

/*

txts: [
        {
            line: 'I am a meme',
            size: 24,
            align: 'center',
            color: '#000',
            pos: {x: 10, y: 100},
            dimensions: undefined
        },{
            line: 'I am a meme',
            size: 24,
            align: 'center',
            color: '#f00',
            pos: {x: 10, y: 200}
        },{
            line: 'I am a meme',
            size: 24,
            align: 'center',
            color: '#0f0',
            pos: {x: 10, y: 260}
        }
    ]

    */