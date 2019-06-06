let gCanvas;
let gCtx;
function init() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    createTexts();
    console.log(getTexts());
    renderCanvas();
    console.log('loaded');
}

function renderCanvas() {
    // render image


    // render texts
    let texts = getTexts();
    texts.forEach(text => {
        // gCtx.beginPath();
        let textX = text.pos.x;
        let textY = text.pos.y;

        gCtx.font = `${text.size}px san-serif`;
        gCtx.fillStyle = text.color;
        gCtx.fillText(text.line, textX, textY);

        let outline = text.outline //mark 
        let outlineHeight = outline.height;
        let outlineWidth = outline.width;

        gCtx.strokeRect(textX, textY, outlineWidth, outlineHeight)
        // gCtx.closePath();
    });

}

function onCanvasClick({ offsetX, offsetY }) {
    console.log('canvas click!');
    console.log(offsetX, offsetY);

    let text = getTexts().find(text => {    
        return (text.pos.x < offsetX && text.pos.x + text.outline.width > offsetX)
            && (offsetY > text.pos.y - outerHeight && offsetY < text.pos.y - text.outline.height)
    })

    console.log(text);

    //check if in outline
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
