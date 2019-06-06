let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gText = null
let gLastMove = null

let prevImgEl = null;

function init() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    createTexts();
    // j
    renderImages();
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
            let imgHtml = `<img onclick="onClickImage(this)" src="${fileName}" alt="">`;
            imgsHtml += '<div class="flex grid-item flex-center">';
            imgsHtml += imgHtml;
            imgsHtml += '</div>';
            fileNum++;
        }

    }
    document.querySelector('.images').innerHTML = imgsHtml;
}

function renderImage(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onClickImage(imgEl) {
    if (prevImgEl) prevImgEl.classList.remove('selected')
    imgEl.classList.add('selected')
    updateImgSrc(imgEl.getAttribute('src'));
    renderCanvas();
    prevImgEl = imgEl;
}

function renderCanvas() {
    // render image
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    let imgSrc = getImgSrc();
    if (imgSrc) {
        let imgEl = document.querySelector(`[src="${imgSrc}"`);
        renderImage(imgEl, renderImage);
    }
    if (gText) renderOutline(gText)

    // render texts
    let texts = getTexts();
    texts.forEach(text => {
        // gCtx.beginPath();
        let textX = text.pos.x;
        let textY = text.pos.y;

        gCtx.font = `${text.size}px Rubik`;

        gCtx.fillStyle = text.color;
        gCtx.fillText(text.line, textX, textY + text.outline.height);
        
        gCtx.lineWidth = 2;
        gCtx.strokeText(text.line, textX, textY + text.outline.height);

        // gCtx.closePath();
    });

}

function onCanvasClick({ offsetX, offsetY }) {
    if (gText && gText.line === '') {
        onDeleteText()
    }
    gText = null; //mark: cleaning on click    
    gIsMouseDown = true; //flag
    gLastMove = {
        x: offsetX,
        y: offsetY
    }

    renderCanvas()
    renderMode()

    let text = getClickedText(offsetX, offsetY)
    if (text) {
        gText = text
        renderOutline(text)
        renderMode()
    }
}


function onMouseMove({ offsetX, offsetY }) {
    if (!gIsMouseDown || !gText) return


    let dX = offsetX - gLastMove.x;
    let dY = offsetY - gLastMove.y;

    updatePos(gText, { x: gText.pos.x + dX, y: gText.pos.y + dY })
    renderCanvas()

    gLastMove = {
        x: offsetX,
        y: offsetY
    }
}

function onMouseUp() {
    console.log('end');
    gIsMouseDown = false;
    gMouseDownPos = null;
    // gText = null;
    gLastMove = null;
}


function onAddText() {
    addText()
    gText = getTexts()[getTexts().length - 1]
    renderCanvas()
}

function onStartEditText() {
    if (!gText) return

    let elEditInput = document.querySelector('input#text-edit')
    elEditInput.value = gText.line
    elEditInput.focus();
    renderOutline(gText, 'blue')
}

function editText(el) {
    updateText(gText, el.value)
    updateOutline(gText)
    renderCanvas()

    renderOutline(gText, 'blue') //overitten (also in render canvas)
}

function onSetTextProps() {
    let color = document.querySelector('#color').value
    let size = document.querySelector('#font-size').value
    setTextProps(gText, color, size)
    renderCanvas()
}


function onDeleteText() {
    if (!gText) return;
    deleteText(gText)
    gText = null
    renderCanvas()
    renderMode()
}

function renderOutline(text, color = 'black') {
    let outline = text.outline //mark 
    let outlineHeight = outline.height;
    let outlineWidth = outline.width;

    gCtx.save()
    gCtx.strokeStyle = color
    let pad = 1;
    gCtx.strokeRect(text.pos.x - pad, text.pos.y + pad, outlineWidth + 10, outlineHeight + pad)
    gCtx.restore()
}


function renderMode() {
    let uiEditEls = document.querySelectorAll('.ui-edit > *')
    for (let i = 0; i < uiEditEls.length; i++) {
        uiEditEls[i].disabled = !gText
    }

    if (gText) {
        document.querySelector('#font-size').value = gText.size
        document.querySelector('#color').value = gText.color
    }

}


function downloadCanvas(elLink) {
    gText = null;
    renderCanvas()
    var content = gCanvas.toDataURL('image/jpeg');
    elLink.href = content
}



function getClickedText(offsetX, offsetY) {
    return getTexts().find(text => {
        return (offsetX > text.pos.x && offsetX < text.pos.x + text.outline.width)
            && (offsetY > text.pos.y && offsetY < text.pos.y + text.outline.height)
    })
}






