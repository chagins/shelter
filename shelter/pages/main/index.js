'use strict'

const menu_list = document.querySelector('.menu-list');
const menu_links = document.querySelectorAll('.menu-link');

if(menu_list) {
  menu_list.addEventListener('click', e => {
    if(menu_links.length > 0) {
      menu_links.forEach(menu_link => {
        menu_link.classList.remove('active');
      });
    };
    e.target.classList.add('active');
  })
};