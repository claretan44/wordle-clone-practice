let currLetter = 1;
let currRow = 1;
let currTile;
let letterClass;
let rowClass;
let filledWord = false;
let wordOfTheDay = '';
let finishedGame = false;


function showLoading(){
    const loadingDiv = document.querySelector('.loading-status');
    loadingDiv.innerHTML = 'loading...';
}

function hideLoading(){
    const loadingDiv = document.querySelector('.loading-status');
    loadingDiv.innerHTML = '';
    loadingDiv.style.margin = '0';
}

function showError(){
    const loadingDiv = document.querySelector('.loading-status');
    loadingDiv.innerHTML = 'error: could not get word of the day';
}
async function getWordOfDay()
{
    showLoading();
    try{
        const response = await fetch('https://words.dev-apis.com/word-of-the-day');
        if (!response.ok){
            showError();
            throw new Error(`Response status: ${response.status}`);
        }
        else{
            const processedObject = await response.json();
            wordOfTheDay = processedObject.word.toLowerCase();
            hideLoading();
        }
    }
    catch(error)
    {
        showError();
        throw new Error('No Word Available');
    }
}

/*get the word submitted at the current row */
function getUserWord()
{
    let userWord = '';
    let chara = '';
    let currTile;

    for(let i=1; i<=5; i++)
    {
        currTile = getTile(currRow,i);
        chara = currTile.innerHTML;
        userWord += chara;
    }

    return userWord;
}

/*for checking if a key pressed is a character*/
function isLetter(letter)
{
    return /^[a-zA-Z]$/.test(letter);
}

/*returns the div for the tile at a row and column*/
function getTile(rowNum, letterNum)
{
    rowClass = `row-${rowNum}`;
    letterClass = `letter-${letterNum}`;
    currTile = document.querySelector(`div.letter.${rowClass}.${letterClass}`);
    return currTile;
}

/* the following functions change the css of a given tile depending on the guess */
function greenTile(tile)
{
    tile.style.color = 'white';
    tile.style.backgroundColor = 'green';
}

function yellowTile(tile)
{
    tile.style.color = 'white';
    tile.style.backgroundColor = 'goldenrod';
}

function greyTile(tile)
{
    tile.style.color = 'white';
    tile.style.backgroundColor = 'grey';
}

function processGuess(rowNum, userGuess)
{
    let tile;
    let userChara;
    let wordChara;
    let lettersInWordOfDay = Array.from(wordOfTheDay);

    // check for grey and green tiles
    for (let i = 1; i<=5; i++)
    {
        tile = getTile(rowNum, i);
        userChara = userGuess.charAt(i-1);
        if (wordOfTheDay.includes(userChara))
        {
            wordChara = wordOfTheDay.charAt(i-1);
            if (userChara === wordChara)
            {
                greenTile(tile);
                // replace it with a non alphabetic character so it doesn't get counted by yellow tiles later
                lettersInWordOfDay[i-1] = '3';
            }
        }
        else
        {
            greyTile(tile);
        }
    }

    // check for yellow tiles that aren't green tiles
    // this needs to be done after the first loop in cases like spool guessed against prior
    // to prevent the first o getting marked, the o is removed in the word array by the first loop

    for (let i = 1; i<=5; i++)
    {
        tile = getTile(rowNum, i);
        userChara = userGuess.charAt(i-1);
        if (lettersInWordOfDay.includes(userChara))
        {
            // all green tile characters have already been replaced
            yellowTile(tile);
            // remove so it doesn't get counted twice
            const index = lettersInWordOfDay.indexOf(userChara);
            lettersInWordOfDay[index] = '3';
        }
    }

}

function showWin(rowNumber){
    for(let i = 1; i<=5; i++)
    {
        let tile = getTile(rowNumber, i);
        greenTile(tile);
    }
}

document.addEventListener('DOMContentLoaded', function(event){
    getWordOfDay().then(function(response){
        document.addEventListener('keydown', function(event){
            if(!finishedGame){
                /*stop non-alpha characters */
                if(isLetter(event.key))
                {
                    currTile = getTile(currRow,currLetter);
                    currTile.innerHTML = event.key;
                    if(currLetter===5)
                    {
                        filledWord = true;
                    }
                    else
                    {
                        currLetter += 1;
                    }

                }
                else
                {
                    switch(event.key){
                        case 'Enter':
                            if(filledWord)
                            {
                                let guess = getUserWord().toLowerCase();
                                if (guess === wordOfTheDay)
                                {
                                    showWin(currRow);
                                    alert("YOU WIN!!!");
                                }
                                else
                                {
                                    processGuess(currRow, guess);
                                }
                                filledWord = false;
                                if (currRow < 6)
                                {
                                    currRow += 1;
                                    currLetter = 1;
                                }
                                else if (currRow = 6)
                                {
                                    finishedGame = true; //prevent more typing after the last guess
                                }
                            } 
                            break;
                        case 'Backspace':
                            if (currLetter === 5 && filledWord)
                            {
                                currTile = getTile(currRow,currLetter);
                                currTile.innerHTML = '';
                                filledWord = false;
                            }
                            else if (currLetter>1)
                            {
                                currLetter -= 1;
                                currTile = getTile(currRow,currLetter);
                                currTile.innerHTML = '';
                            }
                            break;
                        case 'Shift':
                            break;
                        case 'CapsLock':
                            break;
                        default:
                            event.preventDefault();
                    }
                }
                /*key is the readable value use that:
                console.log('key: '+event.key);
                console.log('code: '+event.code); */
            }
        });
    });
});