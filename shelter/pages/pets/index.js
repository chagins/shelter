'use strict'

import petsObjects from '../../assets/js/pets.js';

const SCREEN_STANDART = "screen and (min-width: 1280px)";
const SCREEN_MEDIUM_STANDART = 'screen and (min-width: 768px) and (max-width: 1279px)';
const SCREEN_SMALL_MEDIUM = 'screen and (max-width: 767px)';

const MAX_CARDS_COUNT = 48;

const menu_list = document.querySelector('.menu-list');
const menu_links = document.querySelectorAll('.menu-link');
const burger = document.querySelector('.burger');
const logo = document.querySelector('.logo');
const dimmer_menu = document.querySelector('.dimmer-menu');
const dimmer_global = document.querySelector('#dimmer');
const card_wrapper = document.querySelector('.card-wrapper');
const our_friends = document.querySelector('#our-friends');
const navigation = document.querySelector('.navigation');
const btn_page = document.querySelector('#btn-page');
const btn_right = document.querySelector('#btn-right');
const btn_left = document.querySelector('#btn-left');
const btn_begin = document.querySelector('#btn-begin');
const btn_end = document.querySelector('#btn-end');

let generatedPetsIndices = [];
let group_count_card = 0;

if(dimmer_global) {
  dimmer_global.addEventListener('click', closeCardPopup);
}

if(navigation) {
  navigation.addEventListener('click', getNextPage);
}

initCards();

function initCards() {
  group_count_card = getGroupSizes();
  generatedPetsIndices = getPetsIndicies(MAX_CARDS_COUNT, group_count_card, petsObjects);
  getCardGroup(0, group_count_card, card_wrapper);
  btn_page.dataset.page = 1;
}

function getGroupSizes() {
  let count = 0;
  if(window.matchMedia(SCREEN_STANDART).matches) {
    count = 8;
  }
  if(window.matchMedia(SCREEN_MEDIUM_STANDART).matches) {
    count = 6;
  }
  if(window.matchMedia(SCREEN_SMALL_MEDIUM).matches) {
    count = 3;
  }
  return count;
}

function getCardGroup(startIndex, count, node) {
  node.innerHTML = '';
  for(let i = startIndex; i < startIndex + count; i++){ 
    node.append(getPetCard(generatedPetsIndices[i], petsObjects));
  }
}

function getPetCard(index, sourceArr) {
  const pet = sourceArr[index];
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
  card.dataset.index = index;
  card.addEventListener('click', openCardPopup);
  return card;
}

function getPetsIndicies(count, groupSize, sourceArr) {
  let groupCount = Math.floor(count / groupSize);
  let resultArr = [];
  for(let i = 0; i < groupCount; i++) {
    let stackArr = [];
    for(let j = 0; j < group_count_card; j++){
      let index = Math.floor(Math.random() * sourceArr.length);
      if(stackArr.indexOf(index) === -1){
        stackArr.push(index);
      } else {
        j--;
      }
    };
    resultArr.push(...stackArr);
    stackArr = [];
  };
  return resultArr;
};

function getNextPage(e) {

  const btnClassReady = 'btn-pag ready';
  const btnClassDisabled= 'btn-pag disabled';

  let currentPage = (+btn_page.dataset.page);
  const pressedBtn = e.target;

  const hasLeftPages = () => currentPage > 1;
  const hasRightPages = () => generatedPetsIndices.length-1 > currentPage * group_count_card;
  const setBtnStatus = () => {
    btn_left.className = hasLeftPages() ? btnClassReady : btnClassDisabled;
    btn_right.className = hasRightPages() ? btnClassReady : btnClassDisabled;
    btn_begin.className = hasLeftPages() ? btnClassReady : btnClassDisabled;
    btn_end.className = hasRightPages() ? btnClassReady : btnClassDisabled;
  }

  if(pressedBtn === btn_right && hasRightPages()) {
    let nextItemIndex = currentPage * group_count_card;
    getCardGroup(nextItemIndex, group_count_card, card_wrapper);
    btn_page.dataset.page = ++currentPage;
    btn_page.innerText = btn_page.dataset.page;
  };

  if(pressedBtn === btn_end && hasRightPages()) {
    let nextItemIndex = MAX_CARDS_COUNT - group_count_card;
    getCardGroup(nextItemIndex, group_count_card, card_wrapper);
    currentPage = MAX_CARDS_COUNT / group_count_card;
    btn_page.dataset.page = currentPage
    btn_page.innerText = currentPage;
  };

  if(pressedBtn === btn_left && hasLeftPages()) {
    let nextItemIndex = (currentPage - 1) * group_count_card - group_count_card; 
    getCardGroup(nextItemIndex, group_count_card, card_wrapper);
    btn_page.dataset.page = --currentPage;
    btn_page.innerText = btn_page.dataset.page;
  };

  if(pressedBtn === btn_begin && hasLeftPages()) {
    let nextItemIndex = 0; 
    getCardGroup(nextItemIndex, group_count_card, card_wrapper);
    currentPage = 1;
    btn_page.dataset.page = 1;
    btn_page.innerText = 1;
  };

  setBtnStatus();
}



function openCardPopup(e) {
  const selectedCardIndex = e.currentTarget.dataset.index;
  const selectedCard = petsObjects[+selectedCardIndex];
  const popup = document.createElement('div');
  popup.classList.add('popup', 'active');

  const popup_wrapper = document.createElement('div');
  popup_wrapper.classList.add('popup-wrapper');

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

if(dimmer_menu) {
  dimmer_menu.addEventListener('click', openMenu);
}

function openMenu() {
  burger.classList.toggle('active');
  menu_list.classList.toggle('active');
  logo.classList.toggle('menu-open');
  dimmer_menu.classList.toggle('active');
  document.body.classList.toggle('lock');
}
