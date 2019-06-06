let gCanvas;
let gCtx;
function init() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    renderCanvas();


    console.log('loaded');
}

function renderCanvas() {
    // render image


    // render texts
    let texts = getTexts();
    texts.forEach(text => {
        // gCtx.beginPath();
        gCtx.font = `${text.size}px san-serif`;
        gCtx.fillStyle = text.color;
        gCtx.fillText(text.line, text.pos.x, text.pos.y);
        // gCtx.closePath();
    });

}

function onAddText() {
    let memeTextEl = document.querySelector('#meme-text');
    console.log(memeTextEl);
    memeTextEl.focus();
    addText();
}


function onChangeText(textEl) {
    updateText(textEl.value);
    renderCanvas();
}
