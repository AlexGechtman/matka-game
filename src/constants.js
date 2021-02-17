
import {factory} from './utils';
export const canvas = document.getElementById('stage');
export const context = canvas.getContext('2d');
context.fillStyle = 'pink';

export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 20;



export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = 7;
export const BRICK_HEIGHT = 20;
export const BRICK_GAP = 6;

export const TICKER_INTERVAL = 1000 / 60;





/* Paddle */
export const PADDLE_SPEED = 340;
export const PADDLE_KEYS = {
   left: 37,
   right: 39
};




/* Ball */
export const BALL_RADIUS = 10;
export const BALL_SPEED = 90;
export const INITIAL_OBJECTS = {
   ball: {
       position: {
           x: canvas.width / 2,
           y: canvas.height / 2
       },
       direction: {
           x: 2,
           y: 2
       }
   },
   bricks: factory(),
   score: 0
};