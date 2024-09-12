const fetchData = async () => {
  const response = await fetch(
    'https://potterapi-fedeperin.vercel.app/en/characters'
  );
  const data = await response.json();
  saveImagesToLocalStorage(data, 1);
  return data;
};

const saveImagesToLocalStorage = (data, mode) => {
  const arrayOfImages = [];
  switch (mode) {
    case 1:
      for (let i = 0; i < 6; i++) {
        arrayOfImages.push({ img: data[i].image });
      }
      localStorage.setItem('images', JSON.stringify(arrayOfImages));
      break;
    case 2:
      for (let i = 0; i < 8; i++) {
        arrayOfImages.push({ img: data[i].image });
      }
      localStorage.setItem('images', JSON.stringify(arrayOfImages));
      break;
    default:
      for (let i = 0; i < 12; i++) {
        arrayOfImages.push({ img: data[i].image });
      }
      localStorage.setItem('images', JSON.stringify(arrayOfImages));
      break;
  }
};

const cardsWrapper = document.getElementById('wrapper');
const images = JSON.parse(localStorage.getItem('images'));

if (!images) {
  fetchData();
} else {
  images.forEach((image, index) => {
    console.log(image, index);
    const div = document.createElement('div');
    const imgHolder = document.createElement('img');
    imgHolder.setAttribute('src', image.img);
    div.classList.add(`${index}`);
    div.appendChild(imgHolder);
    cardsWrapper.appendChild(div);
  });
}
