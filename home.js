if (window.innerWidth >= 768) {
    var swiper = new Swiper('.ss-swiper-container', {
        loop: true,
        slidesPerView: 3.1,
        spaceBetween: 12,
        pagination: {
            el: '.ss-swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.fc-slider-arrow-next',
            prevEl: '.fc-slider-arrow-prev'
        }
    });
}