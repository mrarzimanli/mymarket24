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

    // Swiper
    const swiperStores = new Swiper(".swiper--stores", {
        slidesPerView: 4,
        spaceBetween: 16,
        navigation: {
            nextEl: ".my-btn--next",
            prevEl: ".my-btn--prev",
        },
    });

    // Fancy Box
    Fancybox.bind('[data-fancybox]', {});

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
