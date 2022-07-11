import EventEmitter from 'node:events';

const emitter = new EventEmitter();

const startGame = () => {
    console.log('The game event has started');
};

emitter.on('startGame', startGame);

export default emitter;