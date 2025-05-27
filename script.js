let currLetter = 1;
let currRow = 1;
let currTile;
let letterClass;
let rowClass;
let filledWord = false;


function isLetter(letter)
{
    return /^[a-zA-Z]$/.test(letter);
}

document.addEventListener('DOMContentLoaded', function(event){
    document.addEventListener('keydown', function(event){
        /*stop non-alpha characters */
        if(isLetter(event.key))
        {
            rowClass = `row-${currRow}`;
            letterClass = `letter-${currLetter}`;
            currTile = document.querySelector(`div.letter.${rowClass}.${letterClass}`);
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
            /*check for 'Enter', 'Backspace', and 'Shift' and 'CapsLock'*/
            /* TODO: allow backspace to go back to previous forms but NOT to submitted words*/
            /* also make sure backspace resets filledword to false if needed */
            /* TODO: stop user from going to a succeeding word if a previous one hasn't been submitted */
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