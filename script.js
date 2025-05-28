let currLetter = 1;
let currRow = 1;
let currTile;
let letterClass;
let rowClass;
let filledWord = false;
let wordOfTheDay = '';


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

function isLetter(letter)
{
    return /^[a-zA-Z]$/.test(letter);
}

function getCurrentTile()
{
    rowClass = `row-${currRow}`;
    letterClass = `letter-${currLetter}`;
    currTile = document.querySelector(`div.letter.${rowClass}.${letterClass}`);
    return currTile;
}

document.addEventListener('DOMContentLoaded', function(event){
    getWordOfDay().then(function(response){
        console.log(wordOfTheDay);
        document.addEventListener('keydown', function(event){
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
                /* TODO: allow backspace to go back to previous forms but NOT to submitted words*/
                /* also make sure backspace resets filledword to false if needed */
                switch(event.key){
                    case 'Enter':
                        if(filledWord)
                        {
                            /*TODO: function to submit word here */
                            filledWord = false;
                            if (currRow < 6)
                            {
                                currRow += 1;
                                currLetter = 1;
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
        });
    });
});