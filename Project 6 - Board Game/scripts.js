function gameStart() {
  this.moves = 3;
         loadGrid()
         loadPlayers()
         loadBlockers()
         loadWeapons()
         movePlayer()
         squareOff()
        //  hover()
}

// Game instructions with button to start game

  $('#startGame').hide();
  $("#attackP1").hide();
  $("#attackP2").hide();
  $("#defendP1").hide();
  $("#defendP2").hide();
  $("#playerTwo-turn").hide();
  $("#winner").hide()

  $("#startBtn").click(function(){
    $("#gameInst").hide();
    $("#startGame").show();
    statDisplay(self.playerOne);
    statDisplay(self.playerTwo);
  });

// Generate random number

function randomNumber() {
  let randomNum = Math.floor(Math.random() * 9);
  return randomNum;
};

function randomCell(){
  return "#"+Math.floor(Math.random()*9)+"-"+Math.floor(Math.random()*9);
  };

function getCoord(p, xOrY) {
  let z = p.substr(1).split("-")
  // console.log(p.position)
  // console.log(z)
  if (xOrY == "x") {
    return parseInt(z[0])
  }
  return parseInt(z[1])
}

// Create Grid

function loadGrid() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      $('.grid-container').append('<div class="grid-item" id="'+row+'-'+col+'"></div>');
    }
  };
};

// Create Players

let playerOne;
let playerTwo;
let moves;
let self = this;
let inAttack = true;

class Player {
    constructor(name, health, currentWeapon, inDefence, src, position) {
        this.name = name;
        this.health = health;
        this.currentWeapon = currentWeapon;
        this.inDefence = inDefence;
        this.src = src;
        this.position = position;
        $(position).addClass(this.name);
}
};

function loadPlayers() {
    this.playerOne = new Player("playerOne", 100, weapons[0], false, "img/testava.png", "#0-0");
    this.playerTwo = new Player("playerTwo", 100, weapons[0], false, "img/testava2.png", "#9-9");
};

let turn = 1;

function movePlayer() {
  $('.grid-item').click(function(e) {
    if ($(this).hasClass('tree') || $(this).hasClass('playerOne') || $(this).hasClass('playerTwo')
    || notDiagonal("#"+this.id) || checkForBlockers("#"+this.id) || maxMoves("#"+this.id)) {
      return alert('This move is not allowed')
    }
    if (turn == 1) {
      $('.playerOne').removeClass('playerOne');
      $(this).addClass('playerOne');
      self.playerOne.position = "#"+this.id
      $("#playerOne-turn").hide();
      $("#playerTwo-turn").show();
      pickupWeapon(self.playerOne, this)
      statDisplay(self.playerOne)
      
      turn = 2;
  } else {
      $('.playerTwo').removeClass('playerTwo');
      $(this).addClass('playerTwo');
      self.playerTwo.position = "#"+this.id
      $("#playerTwo-turn").hide();
      $("#playerOne-turn").show();
      pickupWeapon(self.playerTwo, this)
      statDisplay(self.playerTwo)

      turn = 1;
  }
  })
};

function checkForBlockers(newPosition) {
  let oldPosition = this.currentPlayerPosition();
  let positions = this.splitPosition(newPosition, oldPosition);
    if (positions.x1 != positions.x2) {
      let direction = 1;
      if(positions.x1 > positions.x2) {
         direction = -1;
      } 
      for(i = positions.x1; i != positions.x2; i = i + direction) {
        if($("#"+i+"-"+positions.y1).hasClass('tree')) {
          return true;
        }   
      }
    } else {
      let direction = 1;

      if(positions.y1 > positions.y2) {
         direction = -1;
      } 
      for(i = positions.y1; i != positions.y2; i = i + direction) {
        if($("#"+positions.x1+"-"+i).hasClass('tree')) {
          return true;
        }   
      }
    }
    return false;
}

function checkForWeapons(newPosition) {
  let oldPosition = this.currentPlayerPosition();
  let positions = this.splitPosition(newPosition, oldPosition);
  
}

function notDiagonal(newPosition) {
  let oldPosition = this.currentPlayerPosition();
  let positions = this.splitPosition(newPosition, oldPosition);
    if (positions.x1 != positions.x2 && positions.y1 != positions.y2) {
      return true;
    } return false;
}

function maxMoves(newPosition) {
  let oldPosition = this.currentPlayerPosition();
  let positions = this.splitPosition(newPosition, oldPosition);
    if (Math.abs(positions.x1 - positions.x2) > this.moves || Math.abs(positions.y1 - positions.y2) > this.moves) {
      return true;
    } return false;
}

function splitPosition(positionOne, oldPosition) {
    x1 = this.getCoord(oldPosition, "x");
    x2 = this.getCoord(positionOne, "x");
    y1 = this.getCoord(oldPosition, "y");
    y2 = this.getCoord(positionOne, "y");
    return {"x1":x1, "x2":x2, "y1":y1, "y2":y2}
}

function currentPlayerPosition() {
  let oldPosition; 
      if (turn == 1) {
        oldPosition = self.playerOne.position
      } else {
        oldPosition = self.playerTwo.position
      } 
      return oldPosition
}

function loadWeapons() {  
    for (var i = 1; i < 4; i++) {
      $(weapons[i].position).addClass(weapons[i].className)
    }
}

let weapons = [
  {name: "axe", className: "weaponOne", image: "img/axe.png", damage: 20, position: randomCell()},
  {name: "sword", className: "weaponTwo", image: "img/sword.png", damage: 40, position: randomCell()},
  {name: "spell", className: "weaponThree", image: "img/spell.png", damage: 50, position: randomCell()},
  {name: "shovel", className: "weaponFour", image: "img/shovel.png", damage: 30, position: randomCell()},
];

function pickupWeapon(player, cell) {
    if ($(cell).hasClass('weaponOne')) {
        $(cell).removeClass('weaponOne')
        $(cell).addClass(cell.className)
          player.currentWeapon = weapons[0];
          return alert('Picked up Axe')
    } else if ($(cell).hasClass('weaponTwo')) {
               $(cell).removeClass('weaponTwo')
               $(cell).addClass(cell.className)
                player.currentWeapon = weapons[1]
          return alert('Picked up Sword')
    } else if ($(cell).hasClass('weaponThree')) {
               $(cell).removeClass('weaponThree')
               player.currentWeapon = weapons[2]
          return alert('Picked up a Spell')
    } else if ($(cell).hasClass('weaponFour')) {
               $(cell).removeClass('weaponFour')
               player.currentWeapon = weapons[3]
          return alert('Picked up a Shovel') 
    }
}

function loadBlockers() {
  for (var i = 0; i < 4; i++) {
    let x = randomNumber();
    let y = randomNumber();
    $("#"+x+"-"+y).addClass('tree')
  }
};

// SquareOff - Battle functionality

function squareOff() {
  let self = this;
  $('.grid-item').click(function(e) {
    self.combat(self.playerOne, self.playerTwo)
});
}

function combat(p1, p2) {
  let positions = this.splitPosition(p1.position, p2.position)
  if (Math.abs(positions.x1 - positions.x2) == 0 && Math.abs(positions.y1 - positions.y2) == 1 
        || 
      Math.abs(positions.x1 - positions.x2) == 1 && Math.abs(positions.y1 - positions.y2) == 0) {
    if (turn == 2) {
      fight(self.playerOne)
    } else {
      fight(self.playerTwo)
    }
  }
}

// Battle display

// (bug) ** playerOne is always first turn in battle **

function fight(player) {
  $(".gameBoard").hide();
  $("body").removeClass("bgImg");
  $("body").addClass("squareOffBg");
  $("#playerOneSB").css("margin-top", "50px");
  $("#playerTwoSB").css("margin-top", "50px");
    if (player == self.playerOne) {
      $(".fightTurn").show();
      $(".fightTurn2").hide();
      $("#playerTwo-turn").hide();
      $("#playerOne-turn").show();
    } else {
      $(".fightTurn2").show();
      $(".fightTurn").hide();
      $( "#playerOne-turn").hide();
      $( "#playerTwo-turn").show();
    }
}

// Possible temporary function to decide players turn.

function battleTurn(turn) {
  if (turn == 'p1Turn') {
    $(".fightTurn").show();
    $(".fightTurn2").hide();
    $("#playerTwo-turn").hide();
    $("#playerOne-turn").show();
  } else if (turn == 'p2Turn') {
    $(".fightTurn2").show();
    $(".fightTurn").hide();
    $( "#playerOne-turn").hide();
    $( "#playerTwo-turn").show();
  }
}

function statDisplay(player) {
  const health = player.health;
  const weapons = player.currentWeapon;
  const damage = player.currentWeapon.damage;
    if (player === self.playerOne) {
      $("#p1Health").html(health)
      $("#p1Weapon").html(weapons.name)
      $("#p1Damage").html(damage)
    } else {
      $("#p2Health").html(health)
      $("#p2Weapon").html(weapons.name)
      $("#p2Damage").html(damage)
    }
}

// PlayerOne & PlayerTwo attack & defend

const attackP1 = document.getElementById('attackP1')
const defendP1 = document.getElementById('defendP1')
attackP1.onclick = function() {
  battle('attack', self.playerOne, self.playerTwo);
  statDisplay(self.playerTwo);
  battleTurn('p2Turn');
}
defendP1.onclick = function() {
  battle('defend', self.playerOne, self.playerTwo);
  statDisplay(self.playerOne);
  battleTurn('p2Turn');
}
const attackP2 = document.getElementById('attackP2')
const defendP2 = document.getElementById('defendP2')
attackP2.onclick = function() {
  battle('attack', self.playerTwo, self.playerOne);
  statDisplay(self.playerOne);
  battleTurn('p1Turn');
}
defendP2.onclick = function() {
  battle('defend', self.playerTwo, self.playerOne);
  statDisplay(self.playerTwo);
  battleTurn('p1Turn');
}

function battle(mode, attackingPlayer, underAttackPlayer) {
  console.log(attackingPlayer);
  console.log(underAttackPlayer);
  if (mode == 'attack') {
    underAttackPlayer.health -= attackingPlayer.currentWeapon.damage;
  } else {
    let healLimit = underAttackPlayer.currentWeapon.damage / 2;

    attackingPlayer.health += healLimit;
    attackingPlayer.health = Math.min(attackingPlayer.health, 100)
  }
  gameOver();
}

function gameOver() {
      // First player to hit < 1 loses
  if (self.playerOne.health < 1) {
    statDisplay(self.playerOne);
    $("#attackP1").hide();
    $("#defendP1").hide();
    $("#playerOneSB").hide();
    $("#playerTwoSB").hide();
    $("#winner").show()
    // remove Player boxes and have a winner display page
  } else if (self.playerTwo.health < 1) {
    statDisplay(self.playerTwo);
    $("#attackP2").hide();
    $("#defendP2").hide();
    $("#playerOneSB").hide();
    $("#playerTwoSB").hide();
    // remove Player boxes and have a winner display page
    $("#winner").show()
  }
}

function newGame() {
  // When gameOver, give option to started a newGame
}

gameStart();


// 1. Need to stop players moving over tree/blocks

// 2. Need players to be able to pickup weapon when move over and drop currentWeapon