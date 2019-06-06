let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gText = null
let gMouseDownPos = null; //do nothing yet.

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
    let fileType = '.jpg';
    let imgsHtml = '';
    var fileNum = 1;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let paddedFileName = ('' + fileNum).padStart(3, '0');
            let fileName = src + paddedFileName + fileType;
            let imgHtml = `<img src="${fileName}" alt="">`;
            imgsHtml += '<div class="temp" >';
            imgsHtml += imgHtml;
            imgsHtml += '</div>';
            fileNum++;            
        }

    }
    document.querySelector('.images').innerHTML = imgsHtml;
}

function renderCanvas() {
    // render image
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    if (gText) renderOutline(gText)

    // render texts
    let texts = getTexts();
    texts.forEach(text => {
        // gCtx.beginPath();
        let textX = text.pos.x;
        let textY = text.pos.y;

        gCtx.font = `${text.size}px san-serif`;
        gCtx.fillStyle = text.color;
        gCtx.fillText(text.line, textX, textY + text.outline.height);

        // gCtx.closePath();
    });

}

function onCanvasClick({ offsetX, offsetY }) {
    gText = null; //mark: cleaning on click
    gIsMouseDown=true; //flag
    gMouseDownPos = {x:offsetX, y:offsetY} //mark: not using yet

    renderCanvas()

    let text = getClickedText(offsetX, offsetY)
    if (text) {
        renderOutline(text)    
        gText = text
    }
}


function onMouseMove({offsetX, offsetY}) {
    if(!gIsMouseDown || !gText) return

    updatePos(gText, {x:offsetX - gText.outline.width/2, y:offsetY - gText.outline.height/2 })
    renderCanvas()    
}

function onMouseUp() {
    console.log('end');
    gIsMouseDown=false;
    gMouseDownPos = null;
    gText = null;
}


function onEditText({offsetX, offsetY}) {
    let text = getClickedText(offsetX, offsetY);
    if (text) gText = text;
    else return // Double clicked nothing..

    let elEditInput =  document.querySelector('input#text-edit')
    elEditInput.value = text.line
    elEditInput.focus();

    renderOutline(gText, 'blue')
}

function onChangeText(el) {
    updateText(gText, el.value)
    updateOutline(gText)
    renderCanvas()
    renderOutline(gText, 'blue') //overitten (also in render canvas)
}

function renderOutline(text, color='black') {
    let outline = text.outline //mark 
    let outlineHeight = outline.height;
    let outlineWidth = outline.width;
    gCtx.save()
    gCtx.strokeStyle = color
    gCtx.strokeRect(text.pos.x, text.pos.y, outlineWidth, outlineHeight)
    gCtx.restore()
}



function getClickedText(offsetX, offsetY) {
    return getTexts().find(text => {
        return (offsetX > text.pos.x && offsetX < text.pos.x + text.outline.width)
            && (offsetY > text.pos.y && offsetY < text.pos.y + text.outline.height)
    })
}






