const addButtonListeners = () => {
    const button = document.querySelector('#quickGame');
    if (button) {
        button.addEventListener('click', () => {
            console.log('Quick game clicked');
            var params = new URLSearchParams({
                wordLength: 5
            });
            var data = fetch(`/game?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                console.log('response', response.json());
            }).then((data) => {
                console.log('data', data);
            });
        });
    }
}

addButtonListeners();