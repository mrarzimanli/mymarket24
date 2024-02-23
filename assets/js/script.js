(function ($) {
    // Dropdown
    $(document).click(function (e) {
        e.stopPropagation()

        const dropdown = $('.my-dropdown')
        const share = $('.my-share')
        const formControl = $('.my-form__control')

        if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
            dropdown.removeClass('my-dropdown--show')
        }

        if (!share.is(e.target) && share.has(e.target).length === 0) {
            share.removeClass('my-share--show')
        }

        if (!formControl.is(e.target) && formControl.has(e.target).length === 0) {
            formControl.removeClass('my-form__control--show')
        }
    })

    $(document).on('click', '.my-dropdown__header', function (e) {
        e.stopPropagation()
        $('.my-dropdown').not($(this).closest('.my-dropdown')).removeClass('my-dropdown--show')
        $(this).closest('.my-dropdown').toggleClass('my-dropdown--show')
    });

    $(document).on('click', '.my-dropdown__body span', function () {
        selectDropdownValue($(this))
    });

    $(document).on('click', '.my-dropdown__header__prefix', function (e) {
        e.stopPropagation()
        clearDropdownValue($(this))
    });

    // Modal
    $('.my-modal--closeable').click(function (e) {
        const modalContent = $(this).find('.my-modal__content');

        if (!modalContent.is(e.target) && modalContent.has(e.target).length === 0) {
            $(this).modal('hide')
        }
    });

    $('[data-toggle="modal"]').click(function () {
        const modal = $(this).data('target');
        $(modal).modal('show');
    });

    $('[data-close="modal"]').click(function () {
        const modal = $(this).closest('.my-modal')
        $(modal).modal('hide');
    });

    $.fn.modal = function (action) {
        this.each(function () {
            var $modal = $(this);

            switch (action) {
                case 'show':
                    if ($modal.hasClass('my-modal--multi-content')) {
                        $modal.find('.my-modal__content[data-step="1"]').addClass('my-modal__content--show')
                    }
                    $modal.css('display', 'block');
                    $('body').addClass('overflow-hidden');

                    setTimeout(() => {
                        $modal.addClass('my-modal--show')
                    }, 150);
                    break;
                case 'hide':
                    $modal.removeClass('my-modal--show');

                    setTimeout(() => {
                        $modal.css('display', 'none');
                        $('body').removeClass('overflow-hidden');
                        if ($modal.hasClass('my-modal--multi-content')) {
                            $modal.find('.my-modal__content').removeClass('my-modal__content--show');
                        }
                    }, 150);

                    break;
                default:
                    console.error('Unsupported action for modal:', action);
            }
        });
        return this;
    };

    $.fn.modalContent = function (action) {
        this.each(function () {
            var $modalContent = $(this);

            switch (action) {
                case 'show':
                    $modalContent.addClass('my-modal__content--show')
                    break;
                case 'hide':
                    $modalContent.removeClass('my-modal__content--show');
                    break;
                default:
                    console.error('Unsupported action for modalContent:', action);
            }
        });
        return this;
    };

    // $('#btnSendReport').click(function () {
    //     $('#modalReport').modal('hide');
    //     setTimeout(() => {
    //         $('#modalAlert').modal('show');
    //     }, 150);
    // });

    // $('#btnSendOTP').click(function () {
    //     $('#modalContentPhone').modalContent('hide');
    //     $('#modalContentOTP').modalContent('show');
    //     showCountdown();
    //     // əgər geri qayıdıb yeni nomre yazıbsa, intervalı resetləmək üçün true göndər
    //     // showCountdown(reset: true);
    // });

    $('#modalContentOTP .my-btn--back').click(function () {
        $('#modalContentOTP').modalContent('hide');
        $('#modalContentPhone').modalContent('show');
    });

    $('#btnVerifyOTP').click(function () {
        $('#modalLogin').modal('hide');
        $('#modalAlert').modal('show');
        clearLoginForm();
    });

    const clearLoginForm = () => {
        $('#formLogin').find('.my-form__control').val('');
    }

    const showCountdown = (reset) => {

        if ($('.my-countdown').length && !reset) {
            return
        }

        let container = $('.my-form__repeat-otp')
        const countdownEl = `<div class="my-countdown">
                                <span id="minutes">00</span>: <span id="seconds">00</span>
                            </div>`
        container.append(countdownEl)

        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        let curDate = new Date()
        let endDate = new Date(curDate.getTime() + 0.5 * 60000)
        let end = new Date(endDate).getTime()

        let intervalID = setInterval(function () {
            let now = new Date().getTime(),
                distance = end - now;

            if (distance > 1) {
                container.find("#days").text(Math.floor(distance / day))
                container.find("#hours").text(Math.floor((distance % day) / hour))
                container.find("#minutes").text(("0" + (Math.floor((distance % hour) / minute))).slice(-2))
                container.find("#seconds").text(("0" + (Math.floor((distance % minute) / second))).slice(-2))
            } else {
                container.find('#btnRepeatOTP').prop('disabled', false)
                container.find("#days").text("00")
                container.find("#hours").text("00")
                container.find("#minutes").text("00")
                container.find("#seconds").text("00")
                container.find('my-countdown').remove()
                clearInterval(intervalID)
            }
        }, 0);
    }

    // Add to favorite
    // $('.my-btn--fav').click(function (e) {
    //     e.preventDefault()
    //     e.stopPropagation();
    //     $(this).toggleClass('is-fav')
    // });

    // Accordion
    $('.my-accordion__item__header').click(function () {
        const accordionItem = $(this).closest('.my-accordion__item');

        if (!accordionItem.hasClass('my-accordion__item--show')) {
            const activeAccordionItem = $('.my-accordion__item--show');
            activeAccordionItem.removeClass('my-accordion__item--show').find('.my-accordion__item__body').stop(true, false, true).slideUp(250);
            accordionItem.addClass('my-accordion__item--show').find('.my-accordion__item__body').stop(true, false, true).slideDown(250);
        } else {
            accordionItem.removeClass('my-accordion__item--show').find('.my-accordion__item__body').stop(true, false, true).slideUp(250);
        }
    });

    const activeAccordionItem = $('.my-accordion__item--show')
    activeAccordionItem && activeAccordionItem.find('.my-accordion__item__body').stop(true, false, true).slideDown(250);

    // Catalog
    $('.my-btn--catalog').click(function () {
        const category = $('.my-catalog__list__item')
        category.removeClass('my-catalog__list__item--active');
        category.first().toggleClass('my-catalog__list__item--active');

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

    // Share
    $('.my-share__header').click(function () {
        $(this).closest('.my-share').toggleClass('my-share--show');
    });

    $(".my-share__item--copy").click(function () {
        $(this).find("span").fadeIn(150).delay(300).fadeOut(150);
        let $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(this).data('href')).select();
        document.execCommand("copy");
        $temp.remove();
    })

    // Form controls
    $('.my-form__control').click(function () {
        const item = $(this).closest('.my-form__item')
        $(item).removeClass('my-form__item--error');
        $(item).find('.my-form__control__message').remove();
    });

    $('.my-form__control--textarea').on('keyup', function () {
        const count = $(this).val().length;
        const max = $(this).prop('maxLength');

        if (count <= max) {
            $(this).closest('.my-form__item').find('.my-form__char-count__current').text(count);
        }
    });

    $('.my-form__control--select .my-form__control__header').click(function () {
        $(this).closest('.my-form__control--select').toggleClass('my-form__control--show');
    });

    $('.my-form__control__option').click(function () {
        const value = $(this).data("value");
        const text = $(this).text();
        const control = $(this).closest('.my-form__control')
        $(control).toggleClass('my-form__control--show');
        $(control).find('input[type="hidden"]').val(value);
        $(control).find('.my-form__control__header span').text(text);
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
        dropdown.removeClass('my-dropdown--show')
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
})(jQuery)
