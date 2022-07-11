import EventEmitter from 'node:events';

const emitter = new EventEmitter();

const startGame = () => {
    console.log('The game event has started');
};

const showInstructions = () => {

};

emitter.on('startGame', startGame);
emitter.on('showInstructions', showInstructions);

export default emitter;