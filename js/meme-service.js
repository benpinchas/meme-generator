let gMeme = {}

function createTexts() {
    if (!gMeme.txts) {
        gMeme.txts = [
            createText('heloo first', 50, { x: 10, y: 100 }, undefined, 'red'),
            createText('sfqwdew ', 10, { x: 10, y: 200 }, undefined, 'blue'),
            createText(' by by by', 25, { x: 10, y: 270 }, undefined, 'black')
        ]
    }
}

function addText(line, size, align, color) {
    let newText = createText(line, size, align, color);
    gMeme.txts.push(newText);
}

function createText(line, size, pos, align = 'center', color) {
    let outline = calcOutline(line, size);
    // pos.y = pos.y - outline.height  //mark   
    return { line, size, pos ,align, color, outline };
}



function calcOutline(line, size) {
    let el = document.querySelector('#sizing');
    el.innerText = line;
    el.style.fontSize = size + 'px';
    // hi
    return { width: el.clientWidth + 1, height: el.clientHeight + 1 }
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
    console.log('text', text);
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