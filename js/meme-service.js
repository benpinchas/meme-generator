let gMeme = {
    txts: [
        {
            line: 'I am a meme',
            size: 10,
            align: 'center',
            color: '#000',
            pos: {x: 10, y: 10}
        }
    ]
}

function addText(line, size, align, color) {
    let newText = createText(line, size, align, color);
    gMeme.txts.push()
}

function createText(line, size, align, color) {
    return { line, size, align, color };
}