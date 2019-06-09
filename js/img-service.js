var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImages = [
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


function getImages() {
    return gImages;
}


function getImageById(id) {
    return gImages.find(image => {
        return image.id === id
    })
}

