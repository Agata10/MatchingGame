let images = JSON.parse(localStorage.getItem('images'));
let data;

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
        arrayOfImages.push({ img: data[i].image });
        arrayOfImages.push({ img: data[i].image });
      }
      break;
    case 2:
      for (let i = 0; i < 4; i++) {
        arrayOfImages.push({ img: data[i].image });
        arrayOfImages.push({ img: data[i].image });
      }
      break;
    default:
      for (let i = 0; i < 6; i++) {
        arrayOfImages.push({ img: data[i].image });
        arrayOfImages.push({ img: data[i].image });
      }

      break;
  }
  localStorage.setItem('images', JSON.stringify(arrayOfImages));
};

const assignSrcToImgHoldersRandomly = (arrOfIndexes, imgHolders) => {
  const imgHoldersArray = Array.from(imgHolders);
  arrOfIndexes.forEach((randomIndex, indexOfArr) => {
    console.log(indexOfArr);
    console.log(randomIndex);
    imgHoldersArray[indexOfArr].setAttribute('src', images[randomIndex].img);
  });
};

const chooseMode = async (mode) => {
  if (!images) {
    data = await fetchData();
    saveImagesToLocalStorage(data, mode);
    images = JSON.parse(localStorage.getItem('images'));
    console.log('images fetched from local storage');
  }
  const cardsWrapper = document.getElementById('wrapper');
  cardsWrapper.innerHTML = '';
  console.log('yes');

  const arrOfIndexes = [];
  let randomIndex = null;

  images.forEach((image, index) => {
    console.log(image, index);
    const div = document.createElement('div');
    const imgHolder = document.createElement('img');
    imgHolder.classList.add('holder');
    div.classList.add(`${index}`);
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
  assignSrcToImgHoldersRandomly(arrOfIndexes, imgHolders);
};

const easyBtn = document.getElementById('easy-mode');
const mediumBtn = document.getElementById('medium-mode');
const hardBtn = document.getElementById('hard-mode');

easyBtn.addEventListener('click', () => chooseMode(1));
mediumBtn.addEventListener('click', () => chooseMode(2));
hardBtn.addEventListener('click', () => chooseMode(3));
