const start = async () => {
    console.log('Starting game...');
    var params = new URLSearchParams({
        timed: false,
        wordLength: 5,
        maxAttempts: 6,
    });
    try {
        var response = await fetch(`/game/new?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error);
    }
}

const attempt = () => {

}