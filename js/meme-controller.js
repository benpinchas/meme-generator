let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gText = null
let gMouseDownPos = null; //do nothing yet.

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

    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
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
    console.log(offsetX, offsetY);
    gIsMouseDown=true; //flag
    gMouseDownPos = {x:offsetX, y:offsetY}

    renderCanvas()

    let text = getClickedText(offsetX, offsetY)
    console.log('text',text);
    if (text) {
        renderOutline(text)
        
        gText = text
    }
}


function onMouseMove({offsetX, offsetY}) {
    if(!gIsMouseDown || !gText) return
    // console.log('mouse move', gDraggedText);

    let dX = gMouseDownPos.x - offsetX

    console.log(gMouseDownPos.x, offsetX);
    // gMouseDownPos.x 
   
    updatePos(gText, {x:offsetX - gText.outline.width/2, y:offsetY - gText.outline.height/2 })
    renderCanvas()
    renderOutline(gText)
    // console.log(gDraggedText.pos);
    
}

function onMouseUp() {
    console.log('end');
    gIsMouseDown=false;
    gMouseDownPos = null;
    gText = null;
}


function onEditText({offsetX, offsetY}) {
    console.log('edit!');
    let text = getClickedText(offsetX, offsetY);
    if (text) gText = text;

    let elEditInput =  document.querySelector('input#text-edit')
    elEditInput.value = text.line
    elEditInput.focus();
}

function onChangeText(el) {
    updateText(gText, el.value)
    renderCanvas()
}

function renderOutline(text) {
    let outline = text.outline //mark 
    let outlineHeight = outline.height;
    let outlineWidth = outline.width;

    gCtx.strokeRect(text.pos.x, text.pos.y, outlineWidth, outlineHeight)
}



function getClickedText(offsetX, offsetY) {
    return getTexts().find(text => {
        return (offsetX > text.pos.x && offsetX < text.pos.x + text.outline.width)
            && (offsetY > text.pos.y && offsetY < text.pos.y + text.outline.height)
    })
}






