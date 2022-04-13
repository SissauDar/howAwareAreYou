// Reden dat je {} gebruikt bij de paramters is omdat je dan die lijst van paramters ziet bij het aanmaken.
function Card({
    title,
description,
answer,
video,
explanation,
url,
index
  }) {
    Object.assign(this, {
        title,
        description,
        answer,
        video,
        explanation,
        url,
        index
    });
  
  }
  
  Card.prototype.generateHTML = function() {
    return `
    <div class="tinder--card" data-index=${this.index} data-answer=${this.answer} data-explanation=false>
        <img src="${this.url}">
        <h3>${this.title}</h3>
        <p>${this.description}</p>
    </div>
    <div class="tinder--card" data-index=${this.index} data-explanation=true >
        <h3>Explanation</h3>
        <p>${this.explanation}</p>
    </div>
    `;
  };
const cardModule = (function() {

    function initCards() {
        const tinderContainer = document.querySelector('.tinder');
        const allCards = document.querySelectorAll('.tinder--card');
        var newCards = document.querySelectorAll('.tinder--card:not(.removed)');
      
        newCards.forEach(function (card, index) {
          card.style.zIndex = allCards.length - index;
          card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
          card.style.opacity = (10 - index) / 10;
        });
        
        tinderContainer.classList.add('loaded');
      }

    const listenToCards = function() {
      const emojis = document.querySelectorAll('.js-emoji');
      for (const e of emojis) {
        e.addEventListener('click', function() {
          console.log(e.getAttribute('data-key'));
          const name = e.getAttribute('data-key');
          if (dataModule.localStorage.get(name)) {
            dataModule.localStorage.delete(name);
            e.classList.remove('u-selected');
          } else {
            dataModule.localStorage.set(name);
            e.classList.add('u-selected')
          }
        })
      }
    };
  
    const redrawEmojis = function() {
  
    };
  
    return {
        initCards: initCards,
      redrawEmojis: redrawEmojis
    }
  
  })();
const dataAccess = (function() {
  const testDataAPI = ({
    url,
    method = "GET",
    body = null,
    handleError = "Error: "
  }) => {
    return fetch(url, {
        method: method,
        body: body,
      })
      .then(response => response.json())
      .then(data => data)
      .catch(err => handleError(err));

  };
  return {
    testDataAPI: testDataAPI
  };
})();
(async function() {

  document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded ✔');

    const data = await dataAccess.testDataAPI({
      url: 'https://opensheet.elk.sh/15AtUtwjUFkKBXe3V-JtSFNhI08Hngi0t0Wxahe-IC-Y/situations',
      handleError: (error) => console.log('Something went wrong: ', error)
    });
    
    


var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');
var nope = document.getElementById('nope');
var love = document.getElementById('love');
const limitGif = 10;

const cardObj = [];

for (const key in data) {
  console.log(data[key].subject);
  
  // url: `https://api.giphy.com/v1/gifs/random?api_key=laiIak6fXa3h4HNzXAEyjTCyM3KYhcFZ&tag=${data[key].subject}&rating=g`,
  const gif = await dataAccess.testDataAPI({
    url: `https://api.giphy.com/v1/gifs/search?api_key=laiIak6fXa3h4HNzXAEyjTCyM3KYhcFZ&q=${data[key].subject}&limit=${limitGif}`,
    handleError: (error) => console.log('Something went wrong: ', error)
  });
  
console.log(gif.data[0].images);
  cardObj.push(new Card({
    title: data[key].title,
    description: data[key].description,
    answer: data[key].answer,
    video: data[key].video,
    explanation: data[key].explanation,
    url: gif.data[Math.floor(Math.random() * limitGif)].images.downsized_medium.url,
    index: key
  }));

}

let cardHTML = '';

for (const card of cardObj) {
  cardHTML += card.generateHTML();
}


document.querySelector('.js-holder').innerHTML = cardHTML;



cardModule.initCards();
allCards = document.querySelectorAll('.tinder--card');

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on('pan', function (event) {
    el.classList.add('moving');
  });

  hammertime.on('pan', function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle('tinder_arrow-right', event.deltaX > 0);
    tinderContainer.classList.toggle('tinder_arrow-left', event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;
// console.log(event.target.nextElementSibling.classList.add('blur'));
if(event.target.nextElementSibling){

  event.target.nextElementSibling.classList.add('blur')
}
    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
  });

  hammertime.on('panend', function (event) {
    document.body.classList.value = ''
    el.classList.remove('moving');
    const bluredItem = document.querySelector(`.blur`);
    bluredItem.classList.remove('blur');
    tinderContainer.classList.remove('tinder_arrow-right');
    tinderContainer.classList.remove('tinder_arrow-left');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle('removed', !keep);

    if (keep) {
      event.target.style.transform = '';
    } else {
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
      const answer = el.getAttribute('data-answer');
      const explanation = el.getAttribute('data-explanation');
      if(explanation == 'true'){
      }else{
        if( event.deltaX < 0 ){
          if(answer == "left"){
            document.body.classList.add("right");
          }else{
            document.body.classList.add("wrong");
          } 
          
        }else{
          if(answer == "right"){
            document.body.classList.add("right");
          }else{
            document.body.classList.add("wrong");
          }
        }
      }
     
     
      cardModule.initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {
    document.body.classList.value = ''
    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add('removed');
    const answer = card.getAttribute('data-answer');
    const explanation = card.getAttribute('data-explanation');
    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      console.log("Right");
      if(explanation == 'true'){

      }else{
        if(answer == "right"){
          document.body.classList.add("right");
        }else{
          document.body.classList.add("wrong");
        }
      }
    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
      console.log("Left");
      if(explanation == 'true'){

      }else{
      if(answer == "left"){
                document.body.classList.add("right");
              }else{
                document.body.classList.add("wrong");
              } 
          }
        }

    cardModule.initCards();

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);



   

  });

})();