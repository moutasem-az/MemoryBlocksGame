// localStorage.removeItem("allScore");
let arrayOfScore = [];
let allScores = document.querySelector(".allScores");
if (localStorage.getItem("allScore")) {
    arrayOfScore = JSON.parse(localStorage.getItem("allScore"));
    // add scores from LocalStorage to page if it has tasks
    addAllScoreToPage (arrayOfScore);
}
// delete div from local and page
allScores.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        // delete task from local Storage
        deleteScore(e.target.parentElement.getAttribute("data-id"));
        // delete task from page
        e.target.parentElement.remove();
    }
});
let gameTime = parseInt(document.querySelector(".time span").innerHTML);
document.querySelector(".control-button span").onclick = function() {
    let userName = prompt("Enter Your Name");
    if (userName == null || userName == "") {
        document.querySelector(".info-container .name span").textContent = 'UnKnown';
    } else {
        document.querySelector(".info-container .name span").textContent = userName;
    }
    document.querySelector(".control-button").remove();
    let counter = setInterval(() => {
        document.querySelector(".time span").innerHTML = parseInt(document.querySelector(".time span").innerHTML) - 1; 
        if (document.querySelector(".tries-true span").innerHTML == "10") {
            addScore( document.querySelector(".name span").innerHTML,
            (gameTime - parseInt(document.querySelector(".time span").innerHTML)),
            document.querySelector(".tries-wrong span").innerHTML,
            document.querySelector(".tries-true span").innerHTML);
            clearInterval(counter);
            stopClicking();
            showMessageAfterPlaying();
        }
        if (document.querySelector(".time span").innerHTML <= 0) {
            addScore( document.querySelector(".name span").innerHTML,
            (gameTime - parseInt(document.querySelector(".time span").innerHTML)),
            document.querySelector(".tries-wrong span").innerHTML,
            document.querySelector(".tries-true span").innerHTML);
            clearInterval(counter);
            stopClicking();
            showMessageAfterPlaying();
        }      
    }, 1000);
};
let duration = 1000;
let blockContainer = document.querySelector(".memory-game");
let blocks = Array.from(blockContainer.children);
let orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);
// add order css property to game blocks
blocks.forEach( (block, index) => {
    block.style.order = orderRange[index];
    block.addEventListener('click', function() {
        flipBlock(block);
    });
});

// All function
function shuffle(array) {
    let current = array.length,
        temp,
        random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
} 
function flipBlock(selectedBlock) {
    selectedBlock.classList.add('is-flipped');
    let allFlippedBlocks = blocks.filter( (flippedBlock) => flippedBlock.classList.contains('is-flipped'));
    if(allFlippedBlocks.length == 2) {
        // stop click in all blocks => add class no-clicking
        stopClicking();
        setTimeout( () => {
            // remove class no-clicking
            checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
            returnClicking();
        }, duration);
    }
}
function stopClicking() {
    blockContainer.classList.add("no-clicking");
}
function returnClicking() {
    blockContainer.classList.remove("no-clicking");
}
function checkMatchedBlocks(firstBlock, secondBlock) {
    let triesElement = document.querySelector(".tries-wrong span");
    if (firstBlock.dataset.img === secondBlock.dataset.img) {
        firstBlock.classList.remove('is-flipped');
        secondBlock.classList.remove('is-flipped');
        firstBlock.classList.add('is-matched');
        secondBlock.classList.add('is-matched');
        // document.getElementById('success').play();
        // document.getElementById('fail').play();
    } else {
        triesElement.innerHTML =parseInt(triesElement.innerHTML) + 1;
        setTimeout( () => {
            firstBlock.classList.remove('is-flipped');
            secondBlock.classList.remove('is-flipped');
        }, duration);
    }
}
function showMessageAfterPlaying() {
    let message = document.createElement("div");
    if (document.querySelector(".tries-true span").innerHTML == "10") {
        message.classList.add("message");
        message.classList.add("show");
        let span = document.createElement("span");
        span.appendChild(document.createTextNode("You Win"));
        message.appendChild(span);  
    } else {
        message.classList.add("message");
        message.classList.add("show");
        message.classList.add("lost");
        let span = document.createElement("span");
        span.appendChild(document.createTextNode("Game Over"));
        message.appendChild(span);
    }
    document.querySelector('.container').appendChild(message);
}
function addScore(theName, TheTime, theTriesWrong, theTriesTrue) {
    const theScore = {
        id: Date.now(),
        name:theName,
        time: TheTime,
        triesWrong: theTriesWrong,
        triesTrue: theTriesTrue
    };
    arrayOfScore.push(theScore);
    allScores.innerHTML = "";
    addScoreToLocalStorage(arrayOfScore);
    addAllScoreToPage (arrayOfScore);
    // arrayOfScore.pop(theScore);
}
function addScoreToLocalStorage(arrayOfScore) {
    window.localStorage.setItem("allScore", JSON.stringify(arrayOfScore));
}
function addAllScoreToPage (arrayOfScore) {
    // allScore.innerHTML = "";
    arrayOfScore.forEach( (ele) => {
        let scores = document.createElement ("div");
        scores.className = "scores"; 
        scores.setAttribute("data-id", ele.id);
        // start div info
        let info = document.createElement ("div");
        info.className = "info";
        // div left
        let left = document.createElement ("div");
        left.className = "left";
        let divName = document.createElement ("div");
        let spanName = document.createElement ("span");
        spanName.appendChild(document.createTextNode(`Name: ${ele.name}`));
        divName.appendChild(spanName);
        let divTime = document.createElement ("div");
        let spanTime = document.createElement ("span");
        spanTime.appendChild(document.createTextNode(`Time: ${ele.time} Sec`));
        divTime.appendChild(spanTime);
        left.appendChild(divName);
        left.appendChild(divTime);
        // div right
        let right = document.createElement ("div");
        right.className = "right";
        let divTrue = document.createElement ("div");
        let spanTrue = document.createElement ("span");
        spanTrue.appendChild(document.createTextNode(`True Tries: ${ele.triesTrue}`));
        divTrue.appendChild(spanTrue);
        let divWrong = document.createElement ("div");
        let spanWrong = document.createElement ("span");
        spanWrong.appendChild(document.createTextNode(`Wrong Tries: ${ele.triesWrong}`));
        divWrong.appendChild(spanWrong);
        right.appendChild(divTrue);
        right.appendChild(divWrong);
        info.appendChild(left);
        info.appendChild(right);
        // end div info
        // start div delete
        let deleted = document.createElement ("div");
        deleted.className = "delete";
        let deletedSpan = document.createElement ("span");
        deletedSpan.appendChild(document.createTextNode("X"))
        deleted.appendChild(deletedSpan);
        // end div delete
        // add info and delete to score
        scores.appendChild(info);
        scores.appendChild(deleted);
        allScores.appendChild(scores);
        // console.log(allScores);
    });
}
function deleteScore (scoreId) {
    arrayOfScore = JSON.parse(localStorage.getItem("allScore"));
    arrayOfScore = arrayOfScore.filter((ele) => ele.id != scoreId);
    localStorage.removeItem("allScore");
    addScoreToLocalStorage (arrayOfScore);
    arrayOfScore = [];
}
// localStorage.removeItem("allScore");