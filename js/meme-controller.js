//combine
let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gLastMove = null
let gImgEl = null;

let gEditDiv = null
//same1


function init() {
    gCanvas = document.querySelector('#meme-canvas');
    if (window.innerWidth < 800 || window.innerHeight < 600) {
        gCanvas.width = screen.width - 20;
        gCanvas.height = screen.height / 2;

        createTexts(gCanvas.width, gCanvas.height)
    } else {
        createTexts();
    }
    gCtx = gCanvas.getContext('2d');
   
    renderImages();

    renderCanvas()
    renderEditDivs();

    renderKeywords()
} //same 2



//b: TODO: write function im img-servise that returns keywordsMap;
function renderKeywords() {
    let elKeyWords = document.querySelector('.keywords');
    let keywordsMap = {}
    getImages().forEach(image => {
        image.keywords.forEach(keyword => {
            if(keywordsMap[keyword]) {
                keywordsMap[keyword]++
            } else {
                keywordsMap[keyword] = 1;
            }
        })
    })

    let strHTMLs = [`<span class="keyword" style="font-size:23px" onclick="renderImages()"> All(${getImages().length})</span>`]
    for (const keyword in keywordsMap) {
        let fontSize = Math.min(15 + keywordsMap[keyword]*2, 31)
        let strHTML = `
        <span class="keyword" 
        style="font-size:${fontSize}px"
        onclick="renderImages('${keyword}')"
        >
            ${keyword}(${keywordsMap[keyword]}) 
        </span>`
        strHTMLs.push(strHTML)
    }

    elKeyWords.innerHTML = strHTMLs.join('')
    console.log(keywordsMap);
}


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
            <img onclick="onClickImage(this, '${image.id}')"
            data-id="${image.id}"
            src="${image.url}" alt="">
        </div>
        `
    })

    document.querySelector('.images').innerHTML = strHTMLs.join('');
}

//TODO ??? insert to on image click
function renderImage(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}


function onAddKeyword(elInput) {
    let image = getImageById(gImgEl.dataset.id)
    addKeyWord(image, elInput.value)
    elInput.value = ''
    renderImageKeywords(image)
}

function onRemoveKeyword(keywordIdx) { //ben mark
    console.log(keywordIdx);
    let image = getImageById(gImgEl.dataset.id)
    removeKeyword(image, keywordIdx)
    renderImageKeywords(image)
}

function renderImageKeywords(image) {
    let strHTMLs = image.keywords.map((keyword, idx) => {
        return `
            <span>${keyword} <button onclick="onRemoveKeyword(${idx})">X</button></span>
        `
    })
    document.querySelector('.image-keywords-container').classList.remove('hidden')
    document.querySelector('.image-keywords').innerHTML = strHTMLs.join('') 
}

function onClickImage(imgEl, id) {
    if (gImgEl) gImgEl.classList.remove('selected')

    let image = getImageById(id)
    renderImageKeywords(image)

    imgEl.classList.add('selected')
    updateImgSrc(imgEl.getAttribute('src'));
    renderCanvas();
    gImgEl = imgEl;
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    let imgSrc = getImgSrc();
    if (imgSrc) {
        let imgEl = document.querySelector(`[src="${imgSrc}"]`);
        renderImage(imgEl);
    }

    // render canvas texts
    let texts = getTexts();
    texts.forEach(text => {
        // gCtx.beginPath();
        let textX = text.pos.x;
        let textY = text.pos.y;


        gCtx.font = `${text.size}px impact`;
        gCtx.fillStyle = text.color;
        gCtx.fillText(text.line, textX, textY + text.outline.height);

        gCtx.lineWidth = text.size/17;
        gCtx.strokeText(text.line, textX, textY + text.outline.height);

        // gCtx.closePath();
    });
}



//b: editDivs rendering based on canvasTexts position
function renderEditDivs() {
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
    let canvasText = getTextById(id)
    updateTextContent(canvasText, elEditDiv.innerText)

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
    if (ev.target.id === 'ui-edit') return;
    if (!gEditDiv) return; //b: and let the user scroll also
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
    gIsMouseDown = false;
    gMouseDownPos = null;
    // gText = null;
    gLastMove = null;
}


function onAddText() {
    addText()
    renderCanvas()

    let editDivs = document.querySelectorAll('.text-box');
    for (let i=0; i<editDivs.length; i++) {
        editDivs[i].style.display = 'none'
    } 
    renderEditDivs()
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


