//combine
let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gLastMove = null
let prevImgEl = null;

let gEditDiv = null
//same1


function init() {
    gCanvas = document.querySelector('#meme-canvas');
    if (window.innerWidth < 800 || window.innerHeight < 600) {
        gCanvas.width = screen.width - 20;
        gCanvas.height = screen.height / 2;
    }

    gCtx = gCanvas.getContext('2d');
    createTexts();
    renderImages();

    renderCanvas()
    renderTexts();
} //same 2



//b: regex based filter
function filterImages(str) {
    let regex = new RegExp(str, 'i')
    return getImages().filter(image => {
        return image.keywords.find(keyword => {
            return keyword.match(regex)
        })
    })
}


function renderImages(searchStr) {
    let images = (searchStr) ? filterImages(searchStr) : getImages()
    let strHTMLs = images.map(image => {
        return `
        <div class="flex grid-item flex-center">
            <img onclick="onClickImage(this)" src="${image.url}" alt="">
        </div>
        `
    })

    document.querySelector('.images').innerHTML = strHTMLs.join('');
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
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    let imgSrc = getImgSrc();
    if (imgSrc) {
        let imgEl = document.querySelector(`[src="${imgSrc}"]`);
        renderImage(imgEl);
    }

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

function renderTexts() {

    for (var i = 0; i < getTexts().length; i++) {
        let text = getTexts()[i]
        let editDiv = `<div 
        data-id="${text.id}"
        class="text-box"
        contenteditable="true"
        style="left:${text.pos.x}px; top:${text.pos.y}px; font-size:${text.size}px"
        onmousedown="onEditDivClick(event, this)"
        onkeyup="onKeyUp(this)"
        
        ontouchstart="onTouchStart(event, this)"
        >
        ${text.line}</div>`
        document.querySelector('.canvas-wrap span').innerHTML += editDiv;
    }

}

function onKeyUp(elEditDiv) { //added
    let id = elEditDiv.dataset.id
    let textObj = getTextById(id)
    console.log(textObj);
    updateTextContent(textObj, elEditDiv.innerText)

    renderCanvas()
}

function onCanvasMouseDown(ev) {
    if (ev.target.id === 'meme-canvas') {
        gEditDiv = null
        renderMode()
    }
}



function onEditDivClick(ev, el) {
    gIsMouseDown = true;
    gEditDiv = el

    gLastMove = {
        x: ev.screenX,
        y: ev.screenY
    }

    renderMode()
}


function onMouseMove({ screenX, screenY }) {
    if (!gIsMouseDown || !gEditDiv) return
    console.log(event);

    let dX = screenX - gLastMove.x;
    let dY = screenY - gLastMove.y;

    gEditDiv.style.left = parseInt(gEditDiv.style.left) + dX + 'px';
    gEditDiv.style.top = parseInt(gEditDiv.style.top) + dY + 'px';

    let canvasText = getTextById(gEditDiv.dataset.id)

    updatePos(canvasText, { x: canvasText.pos.x + dX, y: canvasText.pos.y + dY })
    renderCanvas()

    gLastMove = {
        x: screenX,
        y: screenY
    }

}

function onMouseUp() {
    gIsMouseDown = false;
    gLastMove = null;
}

function onTouchStart(ev, elDiv) {
    console.log('onTouchStart');
    gEditDiv = elDiv
    let touch = ev.touches[0];
    let clientX = touch.clientX
    let clientY = touch.clientY

    gLastMove = {
        x: clientX,
        y: clientY
    }

}

function onTouchMove(ev) {
    console.log('here');
    // if (!gEditDiv) return; //b: and let the user scroll also
    ev.preventDefault();

    var touch = ev.touches[0];
    let clientX = touch.clientX
    let clientY = touch.clientY


    let dX = clientX - gLastMove.x;
    let dY = clientY - gLastMove.y;

    let canvasText = getTextById(gEditDiv.dataset.id)
    updatePos(canvasText, { x: canvasText.pos.x + dX, y: canvasText.pos.y + dY })

    gEditDiv.style.left = canvasText.pos.x + 'px'
    gEditDiv.style.top = canvasText.pos.y + 'px'

    renderCanvas()

    gLastMove = {
        x: clientX,
        y: clientY,
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
    // if (!gText) return here
    console.log('here');
    let elEditInput = document.querySelector('input#text-edit')
    elEditInput.value = gText.line
    elEditInput.focus();
    renderOutline(gText)
}

function editText(input) {
    updateText(gText, input.value)
    updateOutline(gText)
    renderCanvas()
    console.log('editttt');
    renderOutline(gText) //overitten (also in render canvas)
}

function onSetTextProps() {
    let color = document.querySelector('#color').value
    let size = document.querySelector('#font-size').value

    gEditDiv.style.fontSize = size + 'px'
    console.log(gEditDiv);
    let text = getTextById(gEditDiv.dataset.id)
    setTextProps(text, color, size)
    renderCanvas()
}

//ben
function onDeleteText() {
    if (!gEditDiv) return;
    let canvasText = getTextById(gEditDiv.dataset.id)
    deleteText(canvasText)
    gEditDiv.style.display = 'none'
    gEditDiv = null
    renderCanvas()
    renderMode()
}

function renderOutline(text, color = 'black') {
    let outline = text.outline //mark 
    let outlineHeight = Math.max(text.size, outline.height)
    let outlineWidth = Math.max(20, outline.width)

    gCtx.save()
    gCtx.strokeStyle = color
    gCtx.setLineDash([6]);
    let pad = 10;
    gCtx.strokeRect(text.pos.x - pad, text.pos.y + pad, outlineWidth + pad, outlineHeight)
    gCtx.restore()
}


//ben
function renderMode() {
    let uiEditEls = document.querySelectorAll('.ui-edit > *')
    for (let i = 0; i < uiEditEls.length; i++) {
        uiEditEls[i].disabled = !gEditDiv
    }
    
    if (gEditDiv) {
        let canvasText = getTextById(gEditDiv.dataset.id)
        document.querySelector('#font-size').value = canvasText.size
        document.querySelector('#color').value = canvasText.color
    }

}



function downloadCanvas(elLink) {
    gText = null;
    renderCanvas()
    var content = gCanvas.toDataURL('image/jpeg');
    elLink.href = content
}











/*
function filterImages(str) {
    return getImages().filter(image => {
       return image.keywords.find(keyword => {
            let lettersArr = keyword.split('')
            lettersArr = lettersArr.splice(0, str.length, str.length)
            lettersArr = lettersArr.join('');
            console.log(lettersArr === str);
            return lettersArr === str
        })
    })

    //one letter mistake:

        let regexes = []
    for (let i = 0; i < str.length; i++) {
        let letters = str.split('')
        letters.splice(i+1, 0, '?')
        let regex = letters.join('')
        regex = new RegExp(regex)
        regexes.push(regex)
        console.log(regexes);
    }
    return getImages().filter(image => {
        return image.keywords.find(keyword => {
            return regexes.find(regex => {
                if (keyword.match(regex)) return true;
            })
        })
    })


} */