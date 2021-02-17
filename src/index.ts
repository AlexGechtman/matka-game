import { animationFrameScheduler, 
         interval, 
         fromEvent, 
         merge,
         combineLatest,
         Subject
        } from 'rxjs';
  
import { distinctUntilChanged, map, scan, withLatestFrom,
         sample
       } from "rxjs/operators";


       import {
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        BALL_RADIUS,
        BRICK_ROWS,
        BRICK_COLUMNS,
        BRICK_HEIGHT,
        BRICK_GAP,
        TICKER_INTERVAL,
        INITIAL_OBJECTS,
        PADDLE_SPEED,
        PADDLE_KEYS,
        BALL_SPEED,
        canvas,
        context
    } from './constants';

import { drawPaddle, 
        drawTitle,
        hit,
        collision,
        drawControls,
        drawAuthor,
        drawBall,
        drawBricks,
        drawScore,
        drawGameOver
    } from './utils';



/* Ticker*/

const ticker$ = interval(TICKER_INTERVAL,animationFrameScheduler) //(1000,animationFrameScheduler)//
.pipe(
    map( () => ({
        time: Date.now(),
        deltaTime: null
      })),
      scan((previous, current) => ({
        time: current.time,
        deltaTime :  (current.time - previous.time)/1000
      }))
 );

/* Paddle*/
 const input$ = merge(
    fromEvent(document,'keydown')
     .pipe(
        map(  
        (event : any ) => {
        switch (event.keyCode) {
            case PADDLE_KEYS.left:
                return -1;
            case PADDLE_KEYS.right:
                return 1;
            default:
                return 0;
        }
        })),
        fromEvent(document,'keyup')
              .pipe(
                map(
                   (e) => {
                        return 0;
                    }
                ))
 ).pipe(distinctUntilChanged());//.subscribe(e=>console.log(e));

const paddle$ = ticker$.pipe(
    withLatestFrom(input$),
    scan((position, [ticker, direction]) => {

        let next = position + direction * ticker.deltaTime * PADDLE_SPEED;
        return Math.max(Math.min(next, canvas.width - PADDLE_WIDTH / 2), PADDLE_WIDTH / 2);
       

    }, canvas.width / 2),
    distinctUntilChanged());//.subscribe(v => console.log(v));


/* Ball */

const objects$ = ticker$.pipe(
    withLatestFrom(paddle$),
    scan(({ball, bricks, collisions, score}, [ticker, paddle]) => {

        let survivors = [];
        collisions = {
            paddle: false,
            floor: false,
            wall: false,
            ceiling: false,
            brick: false
        };

        ball.position.x = ball.position.x + ball.direction.x * ticker.deltaTime * BALL_SPEED;
        ball.position.y = ball.position.y + ball.direction.y * ticker.deltaTime * BALL_SPEED;

        bricks.forEach((brick) => {
            if (!collision(brick, ball)) {
                survivors.push(brick);
            } else {
                collisions.brick = true;
                score = score + 10;
            }
        });

        collisions.paddle = hit(paddle, ball);

        if (ball.position.x < BALL_RADIUS || ball.position.x > canvas.width - BALL_RADIUS) {
            ball.direction.x = -ball.direction.x;
            collisions.wall = true;
        }

        collisions.ceiling = ball.position.y < BALL_RADIUS;

        if (collisions.brick || collisions.paddle || collisions.ceiling ) {
            ball.direction.y = -ball.direction.y;
        }

        return {
            ball: ball,
            bricks: survivors,
            collisions: collisions,
            score: score
        };

    }, INITIAL_OBJECTS));

/* Sounds */

let oscillator;
const audio = new (window.AudioContext);
const beeper = new Subject();
beeper.subscribe( (key : any) => {

    oscillator = audio.createOscillator();
    oscillator.connect(audio.destination);
    oscillator.type = 'square';
    // https://en.wikipedia.org/wiki/Piano_key_frequencies
    oscillator.frequency.value = Math.pow(2, (key - 49) / 12) * 440;
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.100);
});


/* Game */

drawTitle();
drawControls();
drawAuthor();

function update([ticker, paddle, objects]) {

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(paddle);
    drawBall(objects.ball);
    drawBricks(objects.bricks);
    drawScore(objects.score);

    if (objects.ball.position.y > canvas.height - BALL_RADIUS) {
        beeper.next(28);
        drawGameOver('GAME OVER');
        game.unsubscribe();
    }

    if (!objects.bricks.length) {
        beeper.next(52);
        drawGameOver('CONGRATULATIONS');
        game.unsubscribe();
    }

    if (objects.collisions.paddle) beeper.next(40);
    if (objects.collisions.wall || objects.collisions.ceiling) beeper.next(45);
    if (objects.collisions.brick) beeper.next(47 + Math.floor(objects.ball.position.y % 12));

}

const game = combineLatest(ticker$, paddle$, objects$)
            .pipe(sample(ticker$))
            .subscribe(update);