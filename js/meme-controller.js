let gCanvas;
let gCtx;
function init() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    createTexts();
    // j
    renderImages();

    console.log(getTexts());
    renderCanvas();
    console.log('loaded');
}

function renderImages() {
    // loop over images
    let src = 'img/';
    let fileType = '.png';
    let imgsHtml = '';
    for (let i = 1; i <= 25; i++) {
        let paddedFileName = ('' + i).padStart(3, '0');
        let fileName = src + paddedFileName + fileType;
        let imgHtml = `<img src="${fileName}" alt="">`;
        imgsHtml += imgHtml;
    }
    document.querySelector('.grid.images').innerHTML = imgsHtml;
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
        gCtx.fillText(text.line, textX, textY + text.outline.height);

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
        return (offsetX > text.pos.x && offsetX < text.pos.x + text.outline.width)
            && (offsetY > text.pos.y && offsetY < text.pos.y + text.outline.height)
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
