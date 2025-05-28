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
            wordOfTheDay = processedObject.word;
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
        currTile = document.querySelector(`div.letter.row-${currRow}.letter-${i}`);
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

/*returns the div for the next blank tile to be added to*/
function getCurrentTile()
{
    rowClass = `row-${currRow}`;
    letterClass = `letter-${currLetter}`;
    currTile = document.querySelector(`div.letter.${rowClass}.${letterClass}`);
    return currTile;
}

document.addEventListener('DOMContentLoaded', function(event){
    getWordOfDay().then(function(response){
        document.addEventListener('keydown', function(event){
            if(!finishedGame){
                /*stop non-alpha characters */
                if(isLetter(event.key))
                {
                    currTile = getCurrentTile();
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
                                let guess = getUserWord();
                                if (guess === wordOfTheDay)
                                {
                                    alert("YOU WIN!!!");
                                }
                                else
                                {
                                    alert("Wrong guess");
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
                                currTile = getCurrentTile();
                                currTile.innerHTML = '';
                                filledWord = false;
                            }
                            else if (currLetter>1)
                            {
                                currLetter -= 1;
                                currTile = getCurrentTile();
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