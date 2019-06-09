let IMAGES_KEY = 'images_ben_jhony'

let gImages;

function createImages() {
    gImages = loadImages()
    if (!gImages) {
        gImages = [
            {
                id: '1', 
                url: 'img/kiss.jpg',
                keywords: ['lgbt', 'basketball', 'sport', 'love', 'pride']
            },
            {
                id: '2', 
                url: 'img/dancing-women.jpg',
                keywords: ['happy', 'dance', 'flower', 'europe', 'field', 'nature']
            },
            {
                id: '3', 
                url: 'img/dicaprio.jpg',
                keywords: ['bar raffaeli', 'alcohol', 'leonardo dicaprio']
            },
            {
                id: '4', url: 'img/obama.jpg',
                keywords: ['president', 'usa', 'america', 'barak obama']
            },
            {
                id: '5',
                url: 'img/kids.jpg',
                keywords: ['happy', 'dance', 'africa']
            },
            {
                id: '6',
                url: 'img/trump-red.jpg',
                keywords: ['president', 'donald trump', 'usa', 'america']
            },
            {
                id: '7', url: 'img/putin.jpg',
                keywords: ['president', 'russia', 'europe', 'putin']
            },
            {
                id: '8', 
                url: 'img/cat-laptop.jpg',
                keywords: ['sleep', 'laptop', 'cute', 'pet', 'cat', 'animal']
            },
        ];
        saveImages()
    }
}



function getImages() {
    return gImages;
}


function getImageById(id) {
    return gImages.find(image => {
        return image.id === id
    })
}



function addKeyWord(image, keyword) {
    if (image.keywords.indexOf(keyword.toLowerCase()) === -1 ) {
        image.keywords.push(keyword.toLowerCase())
        saveImages()
    } else {
        console.log('Keyword Already exist');
    }
}

function removeKeyword(image, keywordIdx) {
    image.keywords.splice(keywordIdx, 1)
    saveImages()
}


function saveImages() {
    saveToStorage(IMAGES_KEY, gImages)
}


function loadImages() {
    return loadFromStorage(IMAGES_KEY)
}



function saveToStorage(key, value) {
    var strValue = JSON.stringify(value);
    localStorage.setItem(key, strValue);
}
function loadFromStorage(key) {
    console.log('loadFromStorage');
    return JSON.parse(localStorage.getItem(key))
}
