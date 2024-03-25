function modal() {
    function openModal() {
        modalWindow.style.display = 'block';
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerID);
    }
    function closeModal() {
            modalWindow.style.display = 'none';
            document.body.style.overflow = '';
    }
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modalWindow = document.querySelector('.modal'); 
    modalButtons.forEach((item) =>
        item.addEventListener('click', openModal));
    modalWindow.addEventListener('click', (e) =>  {
        if(e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if(e.code == "Escape" && modalWindow.style.display == "block") {
           closeModal();
        }
    });
    const modalTimerID = setTimeout(openModal, 5000);
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    // console.log(window.pageYOffset + " " + document.documentElement.clientHeight + " " + document.documentElement.scrollHeight);
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;