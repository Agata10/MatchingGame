const fetchData = async () => {
  try {
    const response = await fetch(
      'https://potterapi-fedeperin.vercel.app/en/characters'
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
};

const saveImagesToLocalStorage = (data, mode) => {
  const arrayOfImages = [];
  switch (mode) {
    case 1:
      for (let i = 0; i < 3; i++) {
        arrayOfImages.push({ img: data[i].image, number: i });
        arrayOfImages.push({ img: data[i].image, number: i });
      }
      break;
    case 2:
      for (let i = 0; i < 4; i++) {
        arrayOfImages.push({ img: data[i].image, number: i });
        arrayOfImages.push({ img: data[i].image, number: i });
      }
      break;
    default:
      for (let i = 0; i < 6; i++) {
        arrayOfImages.push({ img: data[i].image, number: i });
        arrayOfImages.push({ img: data[i].image, number: i });
      }

      break;
  }
  localStorage.setItem('images', JSON.stringify(arrayOfImages));
};

const assignSrcToImgHoldersRandomly = (arrOfIndexes, imgHolders, images) => {
  arrOfIndexes.forEach((randomIndex, indexOfArr) => {
    // console.log(indexOfArr);
    // console.log(randomIndex);
    imgHolders[indexOfArr].setAttribute('src', images[randomIndex].img);
    imgHolders[indexOfArr].setAttribute('id', `${images[randomIndex].number}`);
  });
};

const playGame = (imgHolders) => {
  let clickCount = 0;
  let prevId = null;
  let match = null;
  let classNameOfImg;
  let images = JSON.parse(localStorage.getItem('images'));

  imgHolders.forEach((img) => {
    img.addEventListener('click', (e) => {
      clickCount++;
      e.target.parentNode.style.transition = 'transform 0.4s ease-out';
      e.target.parentNode.style.transform = 'rotateY(180deg)';
      e.target.style.transition = 'opacity 0.6s ease-out';
      e.target.style.opacity = 1;

      // console.log('id', e.target.id);
      // console.log('clickCount', clickCount);
      //if two cards open
      if (clickCount === 2) {
        //check cards ids
        if (e.target.id !== prevId) {
          //if not equal add opacity and remove counter
          const prevImg = document.querySelector(classNameOfImg);
          prevImg.style.transition = 'opacity 0.6s ease-out';

          setTimeout(() => {
            e.target.parentNode.style.transform = 'rotateY(0deg)'; // Reset transform
            prevImg.parentNode.style.transform = 'rotateY(0deg)';
            e.target.style.opacity = 0;
            prevImg.style.opacity = 0;
            classNameOfImg = null;
            count = 0;
          }, 600);

          //if ids match add match counter and check for game over
        } else {
          match++;
          //check if game over
          if (match * 2 === images.length) {
            const dialog = document.getElementById('win-dialog');
            setTimeout(() => {
              dialog.showModal();
              document.body.style.transition = 'opacity 0.3s ease-out';
              document.body.style.opacity = 0.2;
            }, 700);
          }
        }
        //clear previous image id and counter
        clickCount = 0;
        prevId = null;
      } else {
        prevId = e.target.id;
        classNameOfImg = '.' + e.target.classList.value.replaceAll(' ', '.');
      }
    });
  });
};

const chooseMode = async (mode) => {
  const welcomeDiv = document.getElementById('welcome-div');
  const gameWrapper = document.getElementById('game-wrapper');
  welcomeDiv.style.display = 'none';
  gameWrapper.style.display = 'flex';
  gameWrapper.style.display.opacity = 1;
  const cardsWrapper = document.getElementById('wrapper');
  cardsWrapper.innerHTML = '';
  let images = JSON.parse(localStorage.getItem('images'));

  if (!images) {
    let data = await fetchData();
    saveImagesToLocalStorage(data, mode);
    images = JSON.parse(localStorage.getItem('images'));
    console.log('images fetched from local storage');
  }

  const arrOfIndexes = [];
  let randomIndex = null;
  if (mode === 1) {
    cardsWrapper.style.gridTemplateColumns = 'repeat(3,1fr)';
    cardsWrapper.style.width = '60%';
  } else if (mode === 2) {
    cardsWrapper.style.gridTemplateColumns = 'repeat(4,1fr)';
    cardsWrapper.style.width = '70%';
  } else if (mode === 3) {
    cardsWrapper.style.gridTemplateColumns = 'repeat(6,1fr)';
    cardsWrapper.style.width = '100%';
  }

  images.forEach((image, index) => {
    // console.log(image, index);
    const div = document.createElement('div');
    const imgHolder = document.createElement('img');
    imgHolder.classList.add('holder');
    imgHolder.classList.add(`number-img-${index}`);
    div.classList.add(`${index}`);
    div.classList.add('div-holder');
    div.style.backgroundColor = '#0e1a40';
    imgHolder.style.opacity = 0;
    div.appendChild(imgHolder);
    cardsWrapper.appendChild(div);

    // generate random indexes for images
    do {
      randomIndex = Math.floor(Math.random() * images.length);
    } while (arrOfIndexes.includes(randomIndex));
    arrOfIndexes.push(randomIndex);
  });

  // assing photos with random indexes to the img holders
  const imgHolders = document.getElementsByClassName('holder');
  const imgHoldersArray = Array.from(imgHolders);
  assignSrcToImgHoldersRandomly(arrOfIndexes, imgHoldersArray, images);
  playGame(imgHoldersArray);
};

const clearGame = () => {
  localStorage.removeItem('images');
  const welcomeDiv = document.getElementById('welcome-div');
  const gameWrapper = document.getElementById('game-wrapper');
  welcomeDiv.style.display = 'flex';
  gameWrapper.style.display = 'none';
  const cardsWrapper = document.getElementById('wrapper');
  cardsWrapper.innerHTML = '';
  document.getElementById('win-dialog').close();
  document.body.style.opacity = 1;
};

const songAudio = document.getElementById('gameSong');
const audioImg = document.getElementById('audio-img');
const easyBtn = document.getElementById('easy-mode');
const mediumBtn = document.getElementById('medium-mode');
const hardBtn = document.getElementById('hard-mode');
const audioBtn = document.getElementById('play');
const goBack = document.getElementById('back-btn');
const backBtnGameMode = document.querySelector('.go-back');

easyBtn.addEventListener('click', () => chooseMode(1));
mediumBtn.addEventListener('click', () => chooseMode(2));
hardBtn.addEventListener('click', () => chooseMode(3));
audioBtn.addEventListener('click', () => {
  if (songAudio.paused) {
    songAudio.muted = false;
    audioImg.setAttribute('src', './assets/volume-down-fill.svg');
    songAudio.play();
  } else {
    songAudio.pause();
    audioImg.setAttribute('src', './assets/volume-mute-fill.svg');
  }
});

goBack.addEventListener('click', clearGame);
backBtnGameMode.addEventListener('click', clearGame);
songAudio.volume = 0.1;
localStorage.removeItem('images');
