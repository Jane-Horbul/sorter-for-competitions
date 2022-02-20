import {onClick} from "./common.js"

var isLocked = false;
const markup = {
    getLockPaddings()   { return document.querySelectorAll('.lock-padding'); },
    getWrapperWidth()   { return document.querySelector('.wrapper').offsetWidth; },
    getBody()           { return document.querySelector('body'); },
    lockBody()          { this.getBody().classList.add("lock"); },
    unlockBody()        { this.getBody().classList.remove("lock"); },

    getPopupByLink(l)   { return document.getElementById(l.getAttribute('href').replace('#', '')); },
    getActivePopup()    { return document.querySelector('.popup.open'); },
    markOpened(popup)   { popup.classList.add('open'); },
    markClosed(popup)   { popup.classList.remove('open'); }
    

}

function bodyLock() {
    const lockPaddings  = markup.getLockPaddings();
    const paddingValue  = window.innerWidth - markup.getWrapperWidth() + 'px';
    
    markup.getBody().style.paddingRight = paddingValue;
    for (var i = 0; i < lockPaddings.length; i++)
        lockPaddings[i].style.paddingRight = paddingValue;
    markup.lockBody();
    isLocked = true;
}

function bodyUnLock() {
    const lockPaddings  = markup.getLockPaddings();

    markup.getBody().style.paddingRight = '0px';
    for (var i = 0; i < lockPaddings.length; i++)
        lockPaddings[i].style.paddingRight = '0px';
    markup.unlockBody();
    isLocked = false;
}

function popupOpen(link) {
    const curentPopup = markup.getPopupByLink(link);
    if (curentPopup == undefined)
        return;

    const popupActive = markup.getActivePopup();
    if (popupActive != undefined)
        popupClose(popupActive, false);

    markup.markOpened(curentPopup);
    bodyLock();
    onClick(curentPopup, function (e) {
        if (!e.target.closest('.popup__content'))
            popupClose(e.target.closest('.popup'));
    });
}

function popupClose(popupActive) {
    if (!isLocked)
        return;
    markup.markClosed(popupActive);
    bodyUnLock();
}



const openLinks = document.querySelectorAll('.popup-link');
for (let i = 0; i < openLinks.length; i++)
    onClick(openLinks[i], function(e) { popupOpen(openLinks[i]); e.preventDefault(); });

const closeLinks = document.querySelectorAll('.close-popup');
for (let i = 0; i < closeLinks.length; i++)
    onClick(closeLinks[i], function (e) { popupClose(closeLinks[i].closest('.popup')); e.preventDefault(); })

document.addEventListener('keydown', function(e) {
    if (e.which === 27)
        popupClose(markup.getActivePopup());
});