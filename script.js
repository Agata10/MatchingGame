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
      }
      break;
    case 2:
      for (let i = 0; i < 4; i++) {
        arrayOfImages.push({ img: data[i].image });
      }
      break;
    default:
      for (let i = 0; i < 6; i++) {
        arrayOfImages.push({ img: data[i].image });
      }

      break;
  }
  localStorage.setItem('images', JSON.stringify(arrayOfImages));
};

const chooseMode = async (mode) => {
  if (!images) {
    data = await fetchData();
    saveImagesToLocalStorage(data, mode);
    images = JSON.parse(localStorage.getItem('images'));
    console.log('images fetched from local storage');
  }
  window.location.href = './pages/game.html';
  const cardsWrapper = document.getElementById('wrapper');
  cardsWrapper.innerHTML = '';
  console.log('yes');

  images.forEach((image, index) => {
    console.log(image, index);
    const div = document.createElement('div');
    const imgHolder = document.createElement('img');
    imgHolder.setAttribute('src', image.img);
    div.classList.add(`${index}`);
    div.appendChild(imgHolder);
    cardsWrapper.appendChild(div);
  });
};

const easyBtn = document.getElementById('easy-mode');
const mediumBtn = document.getElementById('medium-mode');
const hardBtn = document.getElementById('hard-mode');

easyBtn.addEventListener('click', () => chooseMode(1));
mediumBtn.addEventListener('click', () => chooseMode(2));
hardBtn.addEventListener('click', () => chooseMode(3));
