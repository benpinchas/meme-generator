let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gText = null
let gMouseDownPos = null; //do nothing yet.

let gLastMove = null

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
    
    let dX = 0;
    if (gLastMove) {
        dX = offsetX - gLastMove.x ;
    } 
    console.log('dx', dX);  

    updatePos(gText, {x:gText.pos.x + dX, y:offsetY - gText.outline.height/2 })
    renderCanvas()    

    gLastMove = {
        x: offsetX,
        y: offsetY
    }
}

function onMouseUp() {
    console.log('end');
    gIsMouseDown=false;
    gMouseDownPos = null;
    gText = null;
    gLastMove = null;
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






