$(function () {
    // Dropdown
    $(document).click(function (e) {
        e.stopPropagation()

        const dropdown = $('.my-dropdown')

        if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
            dropdown.removeClass('show')
        }
    })

    $(document).on('click', '.my-dropdown__header', function (e) {
        e.stopPropagation()
        $('.my-dropdown').not($(this).closest('.my-dropdown')).removeClass('show')
        $(this).closest('.my-dropdown').toggleClass('show')
    });

    $(document).on('click', '.my-dropdown__body span', function () {
        selectDropdownValue($(this))
    });

    $(document).on('click', '.my-dropdown__header__prefix', function (e) {
        e.stopPropagation()
        clearDropdownValue($(this))
    });

    // Add to favorite
    $('.my-btn--fav').click(function (e) {
        e.preventDefault()
        e.stopPropagation();
        $(this).toggleClass('is-fav')
    });

    // Accordion
    $('.my-accordion__item__header').click(function () {
        const accordionItem = $(this).closest('.my-accordion__item');

        if (!accordionItem.hasClass('show')) {
            const activeAccordionItem = $('.my-accordion__item.show');
            activeAccordionItem.removeClass('show').find('.my-accordion__item__body').stop(true, false, true).slideUp(250);
            accordionItem.addClass('show').find('.my-accordion__item__body').stop(true, false, true).slideDown(250);
        } else {
            accordionItem.removeClass('show').find('.my-accordion__item__body').stop(true, false, true).slideUp(250);
        }
    });

    const activeAccordionItem = $('.my-accordion__item.show')
    activeAccordionItem && activeAccordionItem.find('.my-accordion__item__body').stop(true, false, true).slideDown(250);

    // Catalog
    $('.my-btn--catalog').click(function () {
        const category = $('.my-catalog__list__item')
        category.removeClass('my-catalog__list__item--active');
        category.first().addClass('my-catalog__list__item--active');

        $('.my-btn--catalog').toggleClass('my-btn--active');
        $('body').toggleClass('overflow-hidden');
        $('.header__catalog').toggleClass('header__catalog--show');
    })

    $('.my-btn--categories').click(function () {
        $(this).closest('li').find('ul li.hidden').removeClass('hidden');
        $(this).remove()
    })

    $('.my-catalog__list__item').hover(function () {
        const category = $('.my-catalog__list__item')
        category.removeClass('my-catalog__list__item--active');
        $(this).addClass('my-catalog__list__item--active');
    });

    // Swiper
    const swiperStores = new Swiper(".swiper--stores", {
        slidesPerView: 4,
        spaceBetween: 16,
        navigation: {
            nextEl: ".my-btn--next",
            prevEl: ".my-btn--prev",
        },
    });

    const swiperPostThumbs = new Swiper(".swiper--post-thumbs", {
        spaceBetween: 16,
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesProgress: true,
        navigation: {
            nextEl: ".my-btn--next",
            prevEl: ".my-btn--prev",
        },
    });

    const swiperPostGallery = new Swiper(".swiper--post-gallery", {
        spaceBetween: 0,
        thumbs: {
            swiper: swiperPostThumbs,
        },
    });

    // Fancy Box
    Fancybox.bind('[data-fancybox]', {});

    Fancybox.bind("[data-fancybox='gallery']", {});

    // Functions
    function selectDropdownValue(el) {
        const value = el.data("value")
        const text = el.text()
        const dropdown = el.closest('.my-dropdown')

        if (dropdown.hasClass('my-dropdown--clear')) {
            dropdown.find('.my-dropdown__header__content__value').text(text)
        } else {
            dropdown.find('.my-dropdown__header__content').text(text)
        }

        dropdown.find('.my-dropdown__header').data("value", value)
        dropdown.find('.my-dropdown__body span').removeClass("selected")
        dropdown.removeClass('show')
        dropdown.addClass('active')
        el.addClass('selected')
    }

    function clearDropdownValue(el) {
        const dropdown = el.closest('.my-dropdown')

        if (dropdown.hasClass('my-dropdown--clear')) {
            const label = dropdown.find('.my-dropdown__header__content__label').text()
            dropdown.removeClass('active')
            dropdown.find('.my-dropdown__header__content__value').text(label)
            dropdown.find('.my-dropdown__header').removeData("value")
            dropdown.find('.my-dropdown__body span').removeClass("selected")
            el.closest('.filter').find('.filter-input').val('')
        }
    }
})
