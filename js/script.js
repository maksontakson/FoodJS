window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
            tabsContent = document.querySelectorAll('.tabcontent'),
            tabsParent = document.querySelector('.tabheader__items');
 
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    }

    function showTabContent(i) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);

    tabs.forEach(item => {
        item.addEventListener('click', (event) => {
            const target = event.target;
            if(target && target.classList.contains('tabheader__item')) {
                tabs.forEach((item, i) => {
                    if(target == item) {
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
        });
    });


    //timer

    const timer = document.querySelector('.timer'),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            deadLine = '2023-11-03';

    function getRemainingTime(endtime) {
        const t = Date.parse(endtime) - new Date(),
                days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor(t / (1000 * 60 * 60) % 24),
                minutes = Math.floor((t / (1000 * 60) % 24)),
                seconds = Math.floor((t / (1000) % 60));

        return {
            'total': t,
            'days': days,
            'hours': hours, 
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) 
        {return `0${num}`}
        else {
            return num;
        }
    }

    function setClock() {
        timeInterval = setInterval(updateClock, 1000);
        updateClock();
        function updateClock() {
            const clock = getRemainingTime(deadLine);
            days.innerHTML = getZero(clock.days);
            hours.innerHTML = getZero(clock.hours);
            minutes.innerHTML = getZero(clock.minutes);
            seconds.innerHTML = getZero(clock.seconds);

            if(clock.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock();

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

    //class

    class MenuCard {
        constructor (src, alt, title, descr, price, parent) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 40;
            this.parent = document.querySelector(parent);
            this.changeToUah();
        }

        changeToUah() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getRosurce = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    // getRosurce('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
                    data.data.forEach(({img, altimg, title, descr, price}) => {
                        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                    });
                });

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/005 spinner.svg', 
        success: 'Спасибо за ответ, ожидайте звонка',
        failure: 'Ошибка на сервере'
    }

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.style.display = 'none';
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            closeModal();
        }, 4000);
    }

    // Creating clickable slider 0/4 on site 

    const offerSlides = document.querySelectorAll('.offer__slide'),
            currentNumOfferSlide = document.querySelector("#current"),
            nextArrow = document.querySelector('.offer__slider-next'),
            prevArrow = document.querySelector('.offer__slider-prev'),
            maxSlides = offerSlides.length;

    var iterator = 0;


    function hideAllOfferSlides() {
        offerSlides.forEach(item => {
            item.style.display = 'none';
        });
    }

    function showNOfferSlide(i) {
        offerSlides[i].style.display = 'block';
    }

    hideAllOfferSlides();
    showNOfferSlide(0);

    currentNumOfferSlide.textContent = '0' + (iterator +1);

    offerSlides.forEach(item => {
        console.log(item.innerHTML);
    });

    nextArrow.addEventListener('click', (event) => {
        if (iterator == maxSlides - 1) {
            iterator = 0;
            hideAllOfferSlides();
            showNOfferSlide(iterator);
            currentNumOfferSlide.textContent = '0' + (iterator + 1);
        } else {
            hideAllOfferSlides();
            showNOfferSlide(++iterator);
            currentNumOfferSlide.textContent = '0' + (iterator + 1);
        }
        
    });
     
    prevArrow.addEventListener('click', (event) => {
        if(iterator == 0) {
            iterator = maxSlides - 1;
            hideAllOfferSlides();
            showNOfferSlide(iterator);  
            currentNumOfferSlide.textContent = '0' + (iterator + 1);
        } else {
            hideAllOfferSlides();
            showNOfferSlide(--iterator);
            currentNumOfferSlide.textContent = '0' + (iterator + 1);
        }
    });
});