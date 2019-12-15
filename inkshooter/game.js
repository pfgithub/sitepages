var canvas = document.getElementById('canvas');


function log(text){
    $('#console').text(text);
}

var prevy = 0;
var isClicking = false;

function relMouseCoords(e){
    var arr = [];
    console.log(e.originalEvent);
    if(e.originalEvent){
        $.each(e.originalEvent.touches, function(i,bit){
            arr.push({x: bit.pageX, y: bit.pageY});
        });
    }else{
        arr.push({x: e.clientX, y: e.clientY});
        if(isClicking)arr.push({x: 1, y: 1});
    }
    arr.forEach(function(bit,i){
        bit.x = 2000*(bit.x/$(window).width());
        bit.y = 2000*(bit.y/$(window).height());
    });
    return arr;
}

// 0 to window.width
// we want x to 2000


$('#canvas').bind('touchmove',mousemove);
$('#canvas').bind('touchstart',touchstart);
$('#canvas').bind('touchend',touchend);

document.ontouchstart = function(e){ 
    e.preventDefault(); 
};

document.onmousedown = function(e){
    e.preventDefault();  
    isClicking = true;
    touchstart(e);
};

document.onmouseup = function(e){
    e.preventDefault();  
    isClicking = false;
    touchend(e);
};

document.onmousemove = function(e){
    mousemove(e);
};

function getScreen(game,menu){
    switch (Game.screen){
        case GAME:
            if(game)game();
            break;
        case MENU:
            if(menu)menu();
            break;
    }
}

function touchstart(e){
    getScreen(function(){
        touchaction(e,function(){
            Game.isShooting = true;
        }, function(bit){
            prevy = bit.y;
        });
    }, function(){
        var coords = relMouseCoords(e);
        coords.forEach(function(bit){
            if(bit.y < 700 && Game.score >= Game.scorePerHitCost){
                Game.scorePerHit += 1;
                Game.score -= Game.scorePerHitCost;
                Game.scorePerHitCost = Game.nextScorePerHitCost() && Game.score >= Game.damagePerHitCost;
            }else if(bit.y < 1300 && bit.y > 700){
                Game.damagePerHit += 1;
                Game.score -= Game.scorePerHitCost;
                Game.damagePerHitCost = Game.nextScorePerHitCost();
            }else if(bit.y > 1300){
                Game.screen = GAME;
                Game.startTimer();
            }
        });
        Game.draw();
    });
}
function touchend(e){
    getScreen(function(){
        touchaction(e,null, function(bit){
            Game.sprites.you.y += bit.y - prevy;
            prevy = bit.y;
        },function(){
            Game.isShooting = false;
        });
    });
}

function touchaction(e,bullet,move,nbcallback){
    var coords = relMouseCoords(e);
    var nobullet = true;
    coords.forEach(function(bit,i){
        if(bit.x < 500){
            bullet(bit);
            nobullet = false;
        }else{
            if(move){move(bit);}
        }
    });
    if(nobullet){if(nbcallback){nbcallback();}}
}

function mousemove(e){
    getScreen(function(){
        touchaction(e,function(){if(Game.hasBullets > 0)summonBullet();}, function(bit){
            Game.sprites.you.y += bit.y - prevy;
            prevy = bit.y;
        });
    });
}

function summonBullet(){
    Game.sprites.bullet.push(new Sprite('images/inksack.png', Game.sprites.you.x, Game.sprites.you.y + 10, Game.damagePerHit).setSize(100));
}

function summonEnemy(){
    Game.sprites.enemy.push(new Sprite('images/shark.png', 0, randi(0,1500), 10).setSize(200));
}

function randi(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

var Game = {};

Game.score = 0;
Game.scorePerHit = 1;
Game.scorePerHitCost = 100;
Game.nextScorePerHitCost = function(){
    return Game.damagePerHitCost * 2;
};

Game.damagePerHit = 1;
Game.damagePerHitCost = 100;
Game.nextDamagePerHitCost = function(){
    return Game.damagePerHitCost * 2;
};

function addScore(){
    Game.score += Game.scorePerHit;
    updateScore();
}

var updateScore = function(){
    log('Score: ' + Game.score);
    log("Bullets: "+ Game.hasBullets);
};

Game.ctx = canvas.getContext('2d');
Game.isShooting = false;

loadImageAsync('images/underwater.gif', function(res){
    Game.bg = res;
});

loadImageAsync('images/buy.png', function(res){
    Game.buybg = res;
});

Game.sprites = {
    you: new Sprite('images/octopus-a.png', 1900, 0)
        .setSize(200),
    enemy: [],
    bullet: [],
};
var MENU = 1;
var GAME = 0;

Game.screen = GAME;

var secondcounter = 0;
var isSecond = false;

var modes = {
    easy: 2,
    medium: 5,
    hard: 10,
    impossible: 20
};
Game.hasBullets = 100;
Game.spawnrate = modes.hard;

Game.update = function(){
    getScreen(function(){
        secondcounter++;
        if(secondcounter == Math.floor(Game.fps / Game.spawnrate)){
            isSecond = true;
            secondcounter = 0;
            Game.hasBullets += 1;
        }else{
            isSecond = false;
        }
        if(Game.isShooting && Game.hasBullets > 0){
            summonBullet();
            Game.hasBullets -= 1;
        }
        if(isSecond){
            summonEnemy();
        }
        if(Game.sprites.bullet.length > 0){
            Game.sprites.bullet.forEach(function(bit,i){
                bit.x -= 40;
                if(bit.x < 0){
                    Game.sprites.bullet.splice(i,1);
                }
                bit.addSize(-1);
            });
        }
        if(Game.sprites.enemy.length > 0){
            var enemy2 = Game.sprites.enemy.slice(0);
            enemy2.forEach(function(bit,i){
                bit.x += 40;
                if(bit.x > 1998){
                    Game.sprites.enemy.splice(i,1);
                }
                if(bit.touching(Game.sprites.you.bounds)){
                    Game.stopTimer();
                    window.location = "lose.html";
                }
                var dead = false;
                var bullet2 = Game.sprites.bullet;
                bullet2.forEach(function(cit,j){
                    if(cit.touching(bit.bounds)){
                        var vhp = cit.hp;
                        cit.addHP(0 - bit.hp);
                        bit.addHP(0 - vhp);
                        bit.addSize((0 - vhp) * 15);
                        if(bit.isDead()){
                            Game.sprites.enemy.splice(i,1);
                            addScore();
                        }
                        if(cit.isDead()){
                            Game.sprites.bullet.splice(j,1);
                        }
                    }
                });
            });
        }
        if(Game.sprites.you.y < 0)Game.sprites.you.y = 0;
        if(Game.sprites.you.y > 2000){
            Game.sprites.you.y = 1999;
            Game.screen = MENU;
            Game.stopTimer();
        }
    });
};
function drawArray(arr,ctx){
    arr.forEach(function(bit,i){
        bit.draw(ctx);
    });
}
Game.draw = function(){
    getScreen(function(){
            Game.ctx.fillRect(0,0,2000,2000);
            if(Game.bg){
                Game.ctx.drawImage(Game.bg,0,0,2000,2000);
            }
            drawArray(Game.sprites.bullet, Game.ctx);
            Game.sprites.you.draw(Game.ctx);
            drawArray(Game.sprites.enemy, Game.ctx);
            /*Game.sprites.bullet.forEach(function(bit,i){
                bit.draw(Game.ctx);
            });*/
    },function(){
            Game.ctx.fillRect(0,0,2000,2000);
            if(Game.buybg){
                Game.ctx.drawImage(Game.buybg,0,0,2000,2000);
            }
            //Game.ctx.fillRect(0,700,2000,600);
    });
};

Game.fps = 30;

Game.run = function() {
  Game.update();
  Game.draw();
};

Game.startTimer = function(){
    Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
};

Game.stopTimer = function(){
    clearInterval(Game._intervalId);
};

// Start the game loop
Game.startTimer();
