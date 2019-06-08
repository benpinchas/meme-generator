let gCanvas;
let gCtx;
let gIsMouseDown = false //flag
let gText = null
let gLastMove = null

let prevImgEl = null;

function init() {
    gCanvas = document.querySelector('#meme-canvas');
    if (window.innerWidth < 800 || window.innerHeight < 600) {
        gCanvas.width = screen.width-20;
        gCanvas.height = screen.height / 2;
    }

    gCtx = gCanvas.getContext('2d');
    createTexts();
    renderImages();
    renderCanvas()
    // let defaultImg = document.querySelector('[src="img/002.jpg"]');
    // onClickImage(defaultImg)
    console.log('loaded');
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
    if (gText) renderOutline(gText)

    // render texts
    let texts = getTexts();
    texts.forEach(text => {
        // gCtx.beginPath();
        let textX = text.pos.x;
        let textY = text.pos.y;

        gCtx.font = `${text.size}px Impact`;
        gCtx.fillStyle = text.color;
        gCtx.fillText(text.line, textX, textY + text.outline.height);

        gCtx.strokeStyle = 'black';
        gCtx.lineWidth = text.size / 17;
        gCtx.strokeText(text.line, textX, textY + text.outline.height);

        // gCtx.closePath();
    });

}

function onMouseDown({ offsetX, offsetY }) {
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
        onStartEditText()
        // setTimeout(onStartEditText, 0) 
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

function onTouchStart(ev) {
   console.log('onTouchStart');
    console.log(ev);
    var touch = ev.touches[0];
    let clientX = touch.clientX
    let clientY = touch.clientY

    gLastMove = {
        x: clientX,
        y: clientY
    }

}

function onTouchMove(ev) {
    if (!gText) return; //b: and let the user scroll also
    ev.preventDefault(); 
    var touch = ev.touches[0];
    let clientX = touch.clientX
    let clientY = touch.clientY

    

    console.log('here');
    let dX = clientX - gLastMove.x;
    let dY = clientY - gLastMove.y;
    console.log(dX, dY);
    updatePos(gText, { x: gText.pos.x + dX, y: gText.pos.y + dY })
    renderCanvas()

    gLastMove = {
        x: clientX,
        y: clientY
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
    let outlineHeight = Math.max(text.size, outline.height)
    let outlineWidth = Math.max(20, outline.width)

    gCtx.save()
    gCtx.strokeStyle = color
    gCtx.setLineDash([6]);
    let pad = 10;
    gCtx.strokeRect(text.pos.x - pad, text.pos.y + pad, outlineWidth + pad, outlineHeight)
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