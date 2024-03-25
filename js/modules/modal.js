function openModal(modalSelector, modalTimerId) {
    const modalWindow = document.querySelector(modalSelector); 

    modalWindow.style.display = 'block';
    document.body.style.overflow = 'hidden';
    console.log(modalTimerId);
    if(modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modalWindow = document.querySelector(modalSelector); 

    modalWindow.style.display = 'none';
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    const modalButtons = document.querySelectorAll(triggerSelector);
    const modalWindow = document.querySelector(modalSelector); 

    modalButtons.forEach((item) => item.addEventListener('click', () => openModal(modalSelector, modalTimerId)));

    modalWindow.addEventListener('click', (e) =>  {
        if(e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code == "Escape" && modalWindow.style.display == "block") {
           closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModal};
export {openModal};