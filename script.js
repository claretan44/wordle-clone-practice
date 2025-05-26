function isLetter(letter)
{
    return /^[a-zA-Z]$/.test(letter);
}

document.addEventListener('DOMContentLoaded', function(event){
    const container = document.querySelector('.wrapper');
    container.addEventListener('keydown', function(event){
        /*stop non-alpha characters */
        if(!isLetter(event.key))
        {
            /*check for 'Enter', 'Backspace', 'Tab' and 'Shift' and 'CapsLock'*/
            /* TODO: allow backspace to go back to previous forms but NOT to submitted words*/
            /* TODO: stop user from going to a succeeding word if a previous one hasn't been submitted */
            switch(event.key){
                case 'Enter':
                    break;
                case 'Backspace':
                    break;
                case 'Tab':
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