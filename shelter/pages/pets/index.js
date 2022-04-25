'use strict'

const menu_list = document.querySelector('.menu-list');
const menu_links = document.querySelectorAll('.menu-link');
const burger = document.querySelector('.burger');
const logo = document.querySelector('.logo');
const dimmer = document.querySelector('.dimmer');

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

function openMenu() {
  burger.classList.toggle('active');
  menu_list.classList.toggle('active');
  logo.classList.toggle('menu-open');
  dimmer.classList.toggle('active');
  document.body.classList.toggle('lock');
}
