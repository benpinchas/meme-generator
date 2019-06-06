let gMeme = {
    txts: [
        {
            line: 'I am a meme',
            size: 24,
            align: 'center',
            color: '#000',
            pos: {x: 10, y: 100}
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
            pos: {x: 10, y: 300}
        }
    ]
}

function addText(line, size, align, color) {
    let newText = createText(line, size, align, color);
    gMeme.txts.push();
}

function createText(line, size, align, color) {
    return { line, size, align, color };
}

function updateText(line) {
    gMeme.txts[0].line = line;
}

function getTexts() {
    return gMeme.txts;
}