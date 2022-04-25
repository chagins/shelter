'use strict'

import petsObjects from '../../assets/js/pets.js';

const SCREEN_STANDART = "screen and (min-width: 1280px)";
const SCREEN_MEDIUM_STANDART = 'screen and (min-width: 768px) and (max-width: 1279px)';
const SCREEN_SMALL_MEDIUM = 'screen and (max-width: 767px)';

const SLIDER_WIDTH_STANDART = 990;
const SLIDER_WIDTH_MEDIUM = 580;
const SLIDER_WIDTH_SMALL = 270;

const menu_list = document.querySelector('.menu-list');
const menu_links = document.querySelectorAll('.menu-link');
const burger = document.querySelector('.burger');
const dimmer = document.querySelector('.dimmer');
const btn_left = document.querySelector('#btn-left');
const btn_right = document.querySelector('#btn-right');
const slider = document.querySelector('.slider');

let generatedPetsIndices = [];
let sliderWidth = 0;
let group_count_card = 0;

initSlider();

if(menu_list) {
  menu_list.addEventListener('click', e => {
    openMenu(e);
    if(menu_links.length > 0) {
      menu_links.forEach(menu_link => {
        menu_link.classList.remove('active');
      });
    };
    e.target.classList.add('active');
  })
};

if(burger) {
  burger.addEventListener('click', openMenu);
}

if(dimmer) {
  dimmer.addEventListener('click', openMenu);
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
      const cards_left = document.querySelector('#cards-left').innerHTML;
      document.querySelector('#cards-active').innerHTML = cards_left;
      document.querySelector('#cards-left').innerHTML = '';
      slider.style.left = '0';
    } else {
      console.log(animationEvent.animationName);
      slider.classList.remove('transition-right');
      const cards_right = document.querySelector('#cards-right').innerHTML;
      document.querySelector('#cards-active').innerHTML = cards_right;
      document.querySelector('#cards-right').innerHTML = '';
      slider.style.left = '0';
    };

    btn_left.addEventListener('click', moveLeft);
    btn_right.addEventListener('click', moveRight);
  })
}

// functions
function openMenu() {
  burger.classList.toggle('active');
  menu_list.classList.toggle('active');
  dimmer.classList.toggle('active');
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
  return card;
}

function getRandomPet(){
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
