'use strict'

// import petsObjects from '../../assets/js/pets.js';
const petsJSON = await fetch('../../assets/json/pets.json');
const petsObjects = await petsJSON.json();

const SCREEN_STANDART = "screen and (min-width: 1280px)";
const SCREEN_MEDIUM_STANDART = 'screen and (min-width: 768px) and (max-width: 1279px)';
const SCREEN_SMALL_MEDIUM = 'screen and (max-width: 767px)';

const SLIDER_WIDTH_STANDART = 990;
const SLIDER_WIDTH_MEDIUM = 580;
const SLIDER_WIDTH_SMALL = 270;

const menu_list = document.querySelector('.menu-list');
const menu_links = document.querySelectorAll('.menu-link');
const burger = document.querySelector('.burger');
const dimmer_menu = document.querySelector('.dimmer-menu');
const dimmer_global = document.querySelector('#dimmer');
const btn_left = document.querySelector('#btn-left');
const btn_right = document.querySelector('#btn-right');
const slider = document.querySelector('.slider');
const our_friends = document.querySelector('#our-friends');

let generatedPetsIndices = [];
let sliderWidth = 0;
let group_count_card = 0;

initSlider();

if(menu_list) {
  menu_list.addEventListener('click', e => {
    if(e.target.classList.contains('menu-link')) {
      openMenu(e);
      if(menu_links.length > 0) {
        menu_links.forEach(menu_link => {
          menu_link.classList.remove('active');
        });
      };
      e.target.classList.add('active');
    };
    
  })
};

if(burger) {
  burger.addEventListener('click', openMenu);
}

if(dimmer_menu) {
  dimmer_menu.addEventListener('click', openMenu);
}

if(dimmer_global) {
  dimmer_global.addEventListener('click', closeCardPopup);
}

if(btn_left){
  btn_left.addEventListener('click', moveLeft);
}

if(btn_right){
  btn_right.addEventListener('click', moveRight)
}

if(slider) {
  slider.addEventListener('animationend', (animationEvent) => {
    if(animationEvent.animationName === 'move-left') {
      slider.classList.remove('transition-left');
      let cards_left = document.querySelector('#cards-left');
      let cards_active = document.querySelector('#cards-active');
      cards_active.innerHTML = '';
      while(cards_left.childNodes.length > 0) {
        cards_active.appendChild(cards_left.childNodes[0]);
      }
      slider.style.left = '0';
    } else {
      slider.classList.remove('transition-right');
      let cards_right = document.querySelector('#cards-right');
      let cards_active = document.querySelector('#cards-active');
      cards_active.innerHTML = '';
      while(cards_right.childNodes.length > 0) {
        cards_active.appendChild(cards_right.childNodes[0]);
      }
      slider.style.left = '0';
    };

    btn_left.addEventListener('click', moveLeft);
    btn_right.addEventListener('click', moveRight);
  })
}

window.addEventListener('resize', () => {
  if(window.matchMedia(SCREEN_STANDART).matches &&
     sliderWidth !== SLIDER_WIDTH_STANDART ||

     window.matchMedia(SCREEN_MEDIUM_STANDART).matches &&
     sliderWidth !== SLIDER_WIDTH_MEDIUM ||

     window.matchMedia(SCREEN_SMALL_MEDIUM).matches &&
     sliderWidth !== SLIDER_WIDTH_SMALL) {
    resizeSlider();
  }

})

// functions
function openMenu(e) {
  burger.classList.toggle('active');
  menu_list.classList.toggle('active');
  dimmer_menu.classList.toggle('active');
  document.body.classList.toggle('lock');
}

function moveLeft() {
  const cards_left = document.querySelector('#cards-left');
  getCardGroup(cards_left, group_count_card);
  slider.style.left = `-${sliderWidth}px`

  slider.classList.add('transition-left');
  btn_left.removeEventListener('click', moveLeft);
  btn_right.removeEventListener('click', moveRight);
};

function moveRight () {
  const cards_right = document.querySelector('#cards-right');
  getCardGroup(cards_right, group_count_card);
  slider.style.left = '0';

  slider.classList.add('transition-right');
  btn_left.removeEventListener('click', moveLeft);
  btn_right.removeEventListener('click', moveRight);
};

function initSlider() {
  setGroupSizes();
  let cards_active = document.querySelector('#cards-active');
  getCardGroup(cards_active, group_count_card);
}

function resizeSlider() {
  setGroupSizes();
  let cards_active = document.getElementById('cards-active');
  let currentCardsCount = cards_active.childElementCount;
  if(group_count_card > currentCardsCount) {
    getCardGroup(cards_active, group_count_card - currentCardsCount);
  } else {
    for(let i=0; i < currentCardsCount - group_count_card; i++){
      cards_active.removeChild(cards_active.lastChild);
    }
  }
}

function setGroupSizes() {

  if(window.matchMedia(SCREEN_STANDART).matches) {
    group_count_card = 3;
    sliderWidth = SLIDER_WIDTH_STANDART;
  }
  if(window.matchMedia(SCREEN_MEDIUM_STANDART).matches) {
    group_count_card = 2;
    sliderWidth = SLIDER_WIDTH_MEDIUM;
  }
  if(window.matchMedia(SCREEN_SMALL_MEDIUM).matches) {
    group_count_card = 1;
    sliderWidth = SLIDER_WIDTH_SMALL;
  }
}

function getCardGroup(node, count) {
  for(let i = 0; i < count; i++){ 
    node.append(getPetCard());
  }
}

function getPetCard() {
  const pet = getRandomPet();
  const card = document.createElement('div');
  card.classList.add('card');
  const img = document.createElement('img');
  img.src = pet.img;
  img.alt = `pet-${pet.name}`;
  img.width = 270;
  img.height = 270;
  const pet_name = document.createElement('p');
  pet_name.classList.add('pet-name');
  pet_name.innerText = pet.name;
  const button = document.createElement('button');
  button.classList.add('btn', 'pets');
  button.onclick = 'location.href="#fake"';
  button.innerText = 'Learn more';
  card.append(img, pet_name, button);
  card.dataset.index = generatedPetsIndices[generatedPetsIndices.length-1];
  card.addEventListener('click', openCardPopup);
  return card;
}

function getRandomPet() {
  let getRandomIndex = (stackArr, sourceArr) => {
    let index = Math.floor(Math.random() * sourceArr.length);
    while(stackArr.indexOf(index) !== -1 ) {
      index = Math.floor(Math.random() * sourceArr.length);
    };
    return index;
  };

  if (generatedPetsIndices.length > group_count_card * 2) {
    generatedPetsIndices.splice(0, group_count_card);
  }

  let index = getRandomIndex(generatedPetsIndices, petsObjects);
  generatedPetsIndices.push(index);

  return petsObjects[index];
};

function openCardPopup(e) {
  const selectedCardIndex = e.currentTarget.dataset.index;
  const selectedCard = petsObjects[+selectedCardIndex];
  const popup = document.createElement('div');
  popup.classList.add('popup', 'active');

  const popup_wrapper = document.createElement('div');
  popup_wrapper.classList.add('popup-wrapper');
  popup_wrapper.addEventListener('mouseout', hoverOnBtnClose);
  popup_wrapper.addEventListener('mouseover', hoverOffBtnClose);

  const popup_close = document.createElement('button');
  popup_close.classList.add('popup-close');
  popup_close.addEventListener('click', closeCardPopup);
  const img = document.createElement('img');
  img.src = "../../assets/svg/close.svg";
  img.alt = 'close';
  popup_close.appendChild(img);
  popup.appendChild(popup_close);

  const popup_img = document.createElement('img');
  popup_img.classList.add('popup-img');
  popup_img.src = selectedCard.img;
  popup_img.alt = `pet-${selectedCard.name}`;
  popup_img.width = 500;
  popup_img.height = 500;
  popup_wrapper.appendChild(popup_img);

  const popup_content = document.createElement('div');
  popup_content.classList.add('popup-content');

  const popup_title = document.createElement('div');
  popup_title.classList.add('popup-title');
  const pet_name = document.createElement('p');
  pet_name.classList.add('pet-name');
  pet_name.innerText = selectedCard.name;
  const type_breed = document.createElement('p');
  type_breed.classList.add('type-breed');
  type_breed.innerText = `${selectedCard.type} - ${selectedCard.breed}`;
  popup_title.append(pet_name, type_breed);
  popup_content.appendChild(popup_title);

  const popup_descr = document.createElement('p');
  popup_descr.classList.add('popup-description');
  popup_descr.innerText = selectedCard.description;
  popup_content.appendChild(popup_descr);

  const popup_options = document.createElement('ul');
  popup_options.classList.add('popup-options');
  let pet_option = document.createElement('li');
  pet_option.classList.add('pet-option');
  pet_option.innerHTML = `<b>Age:</b> ${selectedCard.age}`;
  popup_options.appendChild(pet_option);

  pet_option = document.createElement('li');
  pet_option.classList.add('pet-option');
  pet_option.innerHTML = `<b>Inoculations:</b> ${selectedCard.inoculations}`;
  popup_options.appendChild(pet_option);

  pet_option = document.createElement('li');
  pet_option.classList.add('pet-option');
  pet_option.innerHTML = `<b>Diseases:</b> ${selectedCard.diseases}`;
  popup_options.appendChild(pet_option);

  pet_option = document.createElement('li');
  pet_option.classList.add('pet-option');
  pet_option.innerHTML = `<strong>Parasites:</strong> ${selectedCard.parasites}`;
  popup_options.appendChild(pet_option);
  popup_content.appendChild(popup_options);
  popup_wrapper.appendChild(popup_content);

  popup.appendChild(popup_wrapper);
  our_friends.appendChild(popup);
  dimmer_global.classList.add('active');
  document.body.classList.add('lock');
}

function closeCardPopup(e) {
  const popup = document.querySelector('.popup');
  popup.remove();
  popup.classList.remove('active');
  dimmer_global.classList.remove('active');
  document.body.classList.remove('lock');
}

function hoverOnBtnClose() {
  const btnClose = document.querySelector('.popup-close');
  btnClose.style['background-color'] = '#FDDCC4';
}

function hoverOffBtnClose() {
  const btnClose = document.querySelector('.popup-close');
  btnClose.style['background-color'] = 'transparent';
}

