console.log("test");

const addButtonListeners = () => {
    const button = document.querySelector('#quickGame');
    if (button) {
        button.addEventListener('click', () => {
            console.log('Quick game clicked');
            var data = fetch(`/word`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                console.log('response', response);
            });
            console.log('data', data);
        });
    }
}

addButtonListeners();