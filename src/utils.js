import { reduce } from 'rxjs/operators';
import {
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    BALL_RADIUS,
    BRICK_ROWS,
    BRICK_COLUMNS,
    BRICK_HEIGHT,
    BRICK_GAP,
    TICKER_INTERVAL,
    PADDLE_SPEED,
    PADDLE_KEYS,
    BALL_SPEED,
    canvas,
    context
} from './constants';


/* Graphics */

export function drawTitle() {
    context.textAlign = 'center';
    context.font = '24px Courier New';
    context.fillText('rxjs breakout', canvas.width / 2, canvas.height / 2 - 24);
}

export function drawControls() {
    context.textAlign = 'center';
    context.font = '16px Courier New';
    context.fillText('press [<] and [>] to play', canvas.width / 2, canvas.height / 2);
}

export function drawGameOver(text) {
    context.clearRect(canvas.width / 4, canvas.height / 3, canvas.width / 2, canvas.height / 3);
    context.textAlign = 'center';
    context.font = '24px Courier New';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
}

export function drawAuthor() {
    context.textAlign = 'center';
    context.font = '16px Courier New';
    context.fillText('by Manuel Wieser', canvas.width / 2, canvas.height / 2 + 24);
}

export function drawScore(score) {
    context.textAlign = 'left';
    context.font = '16px Courier New';
    context.fillText(score, BRICK_GAP, 16);
}

export function drawPaddle(position) {
    context.beginPath();
    context.rect(
        position - PADDLE_WIDTH / 2,
        context.canvas.height - PADDLE_HEIGHT,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );
    context.fill();
    context.closePath();
}

export function drawBall(ball) {
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, BALL_RADIUS, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

export function drawBrick(brick) {
    context.beginPath();
    context.rect(
        brick.x - brick.width / 2,
        brick.y - brick.height / 2,
        brick.width,
        brick.height
    );
    context.fill();
    context.closePath();
}

export function drawBricks(bricks) {
    bricks.forEach((brick) => drawBrick(brick));
}



/* Bricks */

export function factory() {
    let width = (canvas.width - BRICK_GAP - BRICK_GAP * BRICK_COLUMNS) / BRICK_COLUMNS;
    let bricks = [];

    for (let i = 0; i < BRICK_ROWS; i++) {
        for (let j = 0; j < BRICK_COLUMNS; j++) {
            bricks.push({
                x: j * (width + BRICK_GAP) + width / 2 + BRICK_GAP,
                y: i * (BRICK_HEIGHT + BRICK_GAP) + BRICK_HEIGHT / 2 + BRICK_GAP + 20,
                width: width,
                height: BRICK_HEIGHT
            });
        }
    }

    return bricks;
}

export function collision(brick, ball) {
    return ball.position.x + ball.direction.x > brick.x - brick.width / 2
        && ball.position.x + ball.direction.x < brick.x + brick.width / 2
        && ball.position.y + ball.direction.y > brick.y - brick.height / 2
        && ball.position.y + ball.direction.y < brick.y + brick.height / 2;
}

/* Ball */


export function hit(paddle, ball) {
    return ball.position.x > paddle - PADDLE_WIDTH / 2
        && ball.position.x < paddle + PADDLE_WIDTH / 2
        && ball.position.y > canvas.height - PADDLE_HEIGHT - BALL_RADIUS / 2;
}

// export function setCanvas() {
   
//     canvas.width="1000" 
//     canvas.height="500"
//     canvas.style="border:1px solid #c3c3c3"
//     context.fillStyle = "pink";
//     context.fillRect(0,0,canvas.width,canvas.height);

// }

// export function drawTitle(text) {

//     context.textAlign = 'center';
//     context.font = "bold 30px Arial";
//     context.fillStyle = "white";
//     context.fillText(text, canvas.width / 2, canvas.height / 2); 
// }


// export function drawScore (score) {

//     context.textAlign = 'left';
//     context.font = "30px Arial";
//     context.fillStyle = "white";
//     context.fillText(score, BRICK_GAP,20); 
// }

// export function drawPaddle (position) {

//      context.beginPath();
//      context.rect(
//      position - PADDLE_WIDTH /2,
//      context.canvas.height - PADDLE_HEIGHT,
//      PADDLE_WIDTH,
//      PADDLE_HEIGHT
//     );
//     context.fillStyle = "white";
//     context.fill();
//     context.closePath();
// }




// export function calculateObjects(ball, bricks, collisions, score,ticker, paddle) {

//   let  survivors = [];
//   collisions = {
//       paddle: false,
//       floor: false,
//       wall: false,
//       celling: false,
//       brick: false
//   },

//   ball.position.x += ball.direction.x * ticker.deltaTime * BALL_SPEED;
//   ball.position.y += ball.direction.y * ticker.deltaTime * BALL_SPEED;

//   bricks.array.forEach(brick => {
//      if(!collision(brik,ball)) {
//        survivors.push(brick);
//      } else {
//          collisions.brick = true;
//          score =score + 10;
//      } 
//   });


//}