const startButton = document.getElementById("start-button");
startButton.addEventListener("click", function () {
const candyCreate = document.querySelector(".create-candies");
const candies = document.querySelector(".candies");
let lollypops = document.querySelector(".lollypops");
let buyLollypop = document.querySelector(".buy-lollypops");
let generation = document.querySelector(".speed");
let candyRain = document.querySelector(".candy-machine");
let counter = 0;
let lolli = 0;
let speed = 0;
let grunts = 1;
let speedOrc = 0;
let alertShown = false;

candyCreate.addEventListener("click", function () {
  candies.innerText = counter += 10;
});

buyLollypop.addEventListener("click", function () {
  if (counter >= 50) {
    lolli += 1;
    lollypops.innerText = `⭐🪖: ${lolli}`;
    candies.innerText = counter -= 10;
    buyLollypop.disabled = true;
  }
});

let myInterval = setInterval(function () {
  if (lolli >= 1) {
    candies.innerText = counter += 10;
    generation.innerText = speed + 10;
    if (counter >= 500) {
      candyRain.disabled = false;
      if (candies.innerText > 1500) {
        clearInterval(myInterval);
        clearInterval(orcInterval);
        alert(`Wait, let's count them...
        Okay, we have ${candies.innerText} soldiers...
        OMG...that's even more than we were supposed to recruit...
        strange...usually it takes longer...hmmm...wait!...
        you surely were using the third button right?...but still...
        Mission completed!!!`);
      }
    }
  }
}, 1000);


let orcInterval = setInterval(function() {
  document.querySelector('.Grunts').textContent = grunts;
  document.querySelector('.speedOrc').textContent = speedOrc;
  if (grunts >= 1) {
    grunts += 50;
    speedOrc = 50;
    if (grunts > 1500) {
      clearInterval(orcInterval);
      clearInterval(myInterval);
      if (!alertShown) {
        alert(`Wait, let's count them...
        Okay, they have ${grunts} grunts... more that we have soldiers.
        We are overwhelmed, mission failed!!!
        `);
        alertShown = true;
      }
    }
  }
}, 1000);



candyRain.addEventListener("click", function () {
  setInterval(function () {
    counter = counter += 123;
  }, 1000);
  generation.innerText = speed += 123;
  alert(`Hey, that's cheating...you are supposed to get 1000 soldiers 
  'the hard way'(you have to use the 'create soldiers' and 'hire officer' buttons only), 
  so be so kind and stop using this button ok? `)
});
startButton.disabled = true;
});

if(goBackGame !== null) {
  goBackGame.addEventListener("click", function () {
    window.location.href = "http://localhost:3000/main";
  })};
