(function ($) {
    // Document click
    $(document).click(function (e) {
        e.stopPropagation();

        const $target = $(e.target);
        const $dropdown = $('.my-dropdown');
        const $share = $('.my-share');
        const $formControl = $('.my-form__control');
        const $postActions = $('.my-post__actions');
        const isDropdownClick = $dropdown.is($target) || $dropdown.has($target).length > 0;
        const isShareClick = $share.is($target) || $share.has($target).length > 0;
        const isFormControlClick = $formControl.is($target) || $formControl.has($target).length > 0;
        const isPostActionsClick = $postActions.is($target) || $postActions.has($target).length > 0;

        if (!isDropdownClick) {
            $dropdown.removeClass('my-dropdown--show');
        }

        if (!isShareClick) {
            $share.removeClass('my-share--show');
        }

        if (!isFormControlClick) {
            $formControl.removeClass('my-form__control--show');
        }

        if (!isPostActionsClick) {
            $postActions.removeClass('my-post__actions--show');
        }
    });

    // Dropdown
    $(document).on('click', '.my-dropdown__header, .my-dropdown__header__prefix', function (e) {
        e.stopPropagation();
        const $dropdown = $(this).closest('.my-dropdown');
        $('.my-dropdown').not($dropdown).removeClass('my-dropdown--show');
        $dropdown.toggleClass('my-dropdown--show');
    });

    $(document).on('click', '.my-dropdown__body span', function () {
        selectDropdownValue($(this));
    });

    function selectDropdownValue(el) {
        const value = el.data("value");
        const text = el.text();
        const $dropdown = el.closest('.my-dropdown');
        const $headerContent = $dropdown.find('.my-dropdown__header__content');

        if ($dropdown.hasClass('my-dropdown--clear')) {
            $headerContent.find('.my-dropdown__header__content__value').text(text);
        } else {
            $headerContent.text(text);
        }

        $dropdown.find('input[type="hidden"]').val(value).trigger('change').end();
        $dropdown.find('.my-dropdown__header').data("value", value);
        $dropdown.find('.my-dropdown__body span').removeClass("selected");
        $dropdown.removeClass('my-dropdown--show').addClass('active');
        el.addClass('selected');
    }

    $(document).on('click', '.my-dropdown__header__prefix', function (e) {
        e.stopPropagation();
        clearDropdownValue($(this));
    });

    function clearDropdownValue(el) {
        const $dropdown = el.closest('.my-dropdown');

        if ($dropdown.hasClass('my-dropdown--clear')) {
            const label = $dropdown.find('.my-dropdown__header__content__label').text();
            $dropdown.removeClass('active');
            $dropdown.find('.my-dropdown__header__content__value').text(label);
            $dropdown.find('.my-dropdown__header').removeData("value");
            $dropdown.find('.my-dropdown__body span').removeClass("selected");
            el.closest('.filter').find('.filter-input').val('');
        }
    }

    // Modal
    $('.my-modal--closeable').click(function (e) {
        const $modalContent = $(this).find('.my-modal__content');
        if (!$modalContent.is(e.target) && $modalContent.has(e.target).length === 0) {
            $(this).modal('hide');
        }
    });

    $('[data-toggle="modal"]').click(function () {
        const modal = $(this).data('target');
        $(modal).modal('show');
    });

    $('[data-close="modal"]').click(function () {
        const $modal = $(this).closest('.my-modal');
        $modal.modal('hide');
        // Redirect etmək üçün ikinci parametr kimi url gönder
        // $modal.modal('hide', "http://127.0.0.1:5500/wishlist.html");
    });

    $.fn.modal = function (action, url) {
        const showDelay = 150;
        return this.each(function () {
            const $modal = $(this);
            switch (action) {
                case 'show':
                    $modal.css('display', 'block')
                    $('body').addClass('overflow-hidden');
                    if ($modal.hasClass('my-modal--multi-content')) {
                        $modal.find('.my-modal__content[data-step="1"]').modalContent('show');
                    }
                    setTimeout(() => {
                        $modal.css('display', 'block').addClass('my-modal--show');
                    }, showDelay);
                    break;
                case 'hide':
                    $modal.removeClass('my-modal--show');
                    setTimeout(() => {
                        $modal.css('display', 'none');
                        $('body').removeClass('overflow-hidden');
                        if ($modal.hasClass('my-modal--multi-content')) {
                            $modal.find('.my-modal__content').modalContent('hide');
                        }
                        !!url && window.location.replace(url)
                    }, showDelay);
                    break;
                default:
                    console.error('Unsupported action for modal:', action);
            }
        });
    };

    $.fn.modalContent = function (action) {
        return this.each(function () {
            const $modalContent = $(this);
            switch (action) {
                case 'show':
                    $modalContent.addClass('my-modal__content--show');
                    break;
                case 'hide':
                    $modalContent.removeClass('my-modal__content--show');
                    break;
                default:
                    console.error('Unsupported action for modalContent:', action);
            }
        });
    };

    $.fn.preloader = function (action) {
        const $body = $('body');
        return this.each(function () {
            const $container = $(this);
            switch (action) {
                case 'show':
                    $container.addClass($container.is($body) ? 'my-preloader my-preloader--fixed' : 'my-preloader');
                    break;
                case 'hide':
                    $container.removeClass($container.is($body) ? 'my-preloader my-preloader--fixed' : 'my-preloader');
                    break;
                default:
                    console.error('Unsupported action for preloader:', action);
            }
        });
    };

    $.fn.removeEmptyInputs = function () {
        return this.each(function () {
            const $inputs = $(this).find('input');
            $inputs.each(function () {
                const $input = $(this);
                if (!$input.val()) {
                    $input.attr('name', null);
                }
            });
        });
    };

    let intervalID;

    $.showCountdown = function (reset) {

        if ($('.my-countdown').length && !reset) {
            return;
        }

        let container = $('.my-form__repeat-otp');

        if (reset) {
            container.find('#btnRepeatOTP').prop('disabled', true);
            container.find('.my-countdown').remove();
            clearInterval(intervalID);
        }

        const countdownEl = `<div class="my-countdown">
                                <span id="minutes">00</span>: <span id="seconds">00</span>
                            </div>`;
        container.append(countdownEl);

        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        let end = Date.now() + 60 * second;

        intervalID = setInterval(function () { // Assign setInterval to intervalID
            let now = new Date().getTime(),
                distance = end - now;

            if (distance > 1) {
                container.find("#days").text(Math.floor(distance / day));
                container.find("#hours").text(Math.floor((distance % day) / hour));
                container.find("#minutes").text(("0" + (Math.floor((distance % hour) / minute))).slice(-2));
                container.find("#seconds").text(("0" + (Math.floor((distance % minute) / second))).slice(-2));
            } else {
                container.find('#btnRepeatOTP').prop('disabled', false);
                container.find("#days").text("00");
                container.find("#hours").text("00");
                container.find("#minutes").text("00");
                container.find("#seconds").text("00");
                container.find('.my-countdown').remove();
                clearInterval(intervalID);
            }
        }, 0);
    };

    // $('#btnSendReport').click(function () {
    //     $('#modalReport').modal('hide');
    //     setTimeout(() => {
    //         $('#modalAlertReport').modal('show');
    //     }, 150);
    // });

    // $('#btnSendOTP').click(function () {
    //     $('#modalContentPhone').modalContent('hide');
    //     $('#modalContentOTP').modalContent('show');
    //     $.showCountdown();
    //     // əgər geri qayıdıb yeni nomre yazıbsa, intervalı resetləmək üçün true göndər
    //     // showCountdown(reset: true);
    // });

    // $('#btnVerifyOTP').click(function () {
    //     $('#modalLogin').modal('hide');
    //     setTimeout(() => {
    //         $('#modalAlertLogin').modal('show');
    //     }, 150);
    //     $.clearLoginForm();
    // });

    // $('.my-btn--fav').click(function (e) {
    //     e.preventDefault()
    //     e.stopPropagation();
    //     $(this).toggleClass('is-fav')
    // });

    $('#modalContentOTP .my-btn--back').click(function () {
        $('#modalContentOTP').modalContent('hide');
        $('#modalContentPhone').modalContent('show');
    });

    $.clearLoginForm = () => {
        $('#formLogin').find('.my-form__control').val('');
    }

    // Accordion
    $('.my-accordion__item__header').click(function () {
        const accordionItem = $(this).closest('.my-accordion__item');
        const isActive = accordionItem.hasClass('my-accordion__item--show');
        const activeAccordionItem = $('.my-accordion__item--show');

        activeAccordionItem.removeClass('my-accordion__item--show').find('.my-accordion__item__body').stop(true, false, true).slideUp(250);

        if (!isActive) {
            accordionItem.addClass('my-accordion__item--show').find('.my-accordion__item__body').stop(true, false, true).slideDown(250);
        }
    });

    const activeAccordionItem = $('.my-accordion__item--show');
    activeAccordionItem.find('.my-accordion__item__body').stop(true, false, true).slideDown(250);

    // Catalog
    const $catalog = $('.header__catalog');
    const $catalogListItems = $('.my-catalog__list__item');
    const $btnCatalog = $('.my-btn--catalog');

    $btnCatalog.click(function () {
        const isCatalogShown = $catalog.hasClass('header__catalog--show');

        $catalogListItems.removeClass('my-catalog__list__item--active');

        if (!isCatalogShown) {
            $catalogListItems.first().addClass('my-catalog__list__item--active');
        }

        $btnCatalog.toggleClass('my-btn--active');
        $('body').toggleClass('overflow-hidden');
        $catalog.toggleClass('header__catalog--show');
    });

    $('.my-btn--categories').click(function () {
        const $this = $(this)
        $this.closest('li').find('ul li.hidden').removeClass('hidden');
        $this.remove();
    });

    $catalogListItems.hover(function () {
        $catalogListItems.removeClass('my-catalog__list__item--active');
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

    const swiperTags = new Swiper(".swiper--tags", {
        slidesPerView: "auto",
        spaceBetween: 12,
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
        const $span = $(this).find("span");
        $span.fadeIn(150).delay(300).fadeOut(150);

        const $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(this).data('href')).select();
        document.execCommand("copy");
        $temp.remove();
    });

    // Form controls
    $(document).on('click', '.my-form__control', function () {
        const $item = $(this).closest('.my-form__item')

        if ($item.hasClass('my-form__item--error')) {
            $item.removeClass('my-form__item--error');
            $item.find('.my-form__control__message').remove();
        }
    });

    $(document).on('input', '.my-form__control--textarea', function () {
        const $this = $(this);
        const count = $this.val().length;
        const max = $this.prop('maxLength');

        if (count <= max) {
            $this.closest('.my-form__item').find('.my-form__char-count__current').text(count);
        }
    });

    $(document).on('click', '.my-form__control__header', function () {
        const $this = $(this);
        const $currentControl = $this.closest('.my-form__control--select');
        const $activeControls = $('.my-form__control--show').not($currentControl);
        $activeControls.removeClass('my-form__control--show');
        $currentControl.toggleClass('my-form__control--show');
    });

    $(document).on('click', '.my-form__control__option', function () {
        const $option = $(this);
        $.selectOptionValue($option);
    });

    $.selectOptionValue = (option) => {
        const $option = option;
        const value = $option.data("value");
        const html = $option.html();
        const $control = $option.closest('.my-form__control');

        $control.find('.my-form__control__option').removeClass('my-form__control__option--selected');
        $option.addClass('my-form__control__option--selected');
        $control.removeClass('my-form__control--show')
            .find('input[type="hidden"]').val(value).trigger('change').end()
            .find('.my-form__control__header span').html(html);
    }

    $('.my-form__control__option--selected').each(function () {
        const $option = $(this);
        $.selectOptionValue($option)
    });

    $('.my-form__control--select .my-form__control--search').on('input', function () {
        const $this = $(this);
        const $options = $this.closest('.my-form__control__body').find('.my-form__control__option');
        const searchKey = $this.val().toLowerCase();

        $options.each(function () {
            const $option = $(this);
            const text = $option.text().toLowerCase();
            const $groups = $option.parents('.my-form__control__option__group');
            if (text.includes(searchKey)) {
                $option.show();
                $groups.find('.my-form__control__option--label').show();
            } else {
                $option.hide();
            }
        });
    });

    // New Post Form
    $('#postHasDiscount').change(function () {
        const $formItemsWrapper = $(this).closest('.my-form__items-wrapper');
        const $formItemDiscount = $formItemsWrapper.find('.my-form__item--discount');

        $formItemDiscount.toggleClass('my-form__item--show', this.checked);
    });

    const dataTransfer = new DataTransfer();

    $('#postPicture').change(function () {
        const $this = $(this);
        const input = $this[0];
        const files = input.files;
        const $fileList = $this.closest('.my-form__control').find('.file-list');

        if (files.length) {
            [...files].forEach((file, i) => {
                dataTransfer.items.add(file);
                displayFile(file, $fileList, i)
            });
            input.files = dataTransfer.files;
        }
    });

    $('.file-list').on('click', '.file__btn-remove', function () {
        const index = $(this).data('index');
        const $file = $(this).closest('.file');
        const input = $('#postPicture')[0];
        const files = [...input.files].filter((_, i) => i !== index);
        const dataTransfer = new DataTransfer();

        files.forEach(file => {
            dataTransfer.items.add(file);
        });

        input.files = dataTransfer.files;
        $file.remove();
    });

    function displayFile(file, $fileList, index) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileEl = `<div class="file">
                                <div class="file__info">
                                    <img class="file__thumb" src="${e.target.result}">
                                    <span class="file__name">${file.name}</span>
                                </div>
                                <button class="file__btn-remove" data-index="${index}">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91949 3.0755C3.6266 2.78261 3.15172 2.78261 2.85883 3.0755C2.56594 3.3684 2.56594 3.84327 2.85883 4.13617L6.72256 7.9999L2.85883 11.8636C2.56594 12.1565 2.56594 12.6314 2.85883 12.9243C3.15172 13.2172 3.6266 13.2172 3.91949 12.9243L7.78322 9.06056L11.6469 12.9243C11.9398 13.2172 12.4147 13.2172 12.7076 12.9243C13.0005 12.6314 13.0005 12.1565 12.7076 11.8636L8.84388 7.9999L12.7076 4.13619C13.0005 3.84329 13.0005 3.36842 12.7076 3.07553C12.4147 2.78263 11.9398 2.78263 11.6469 3.07553L7.78322 6.93924L3.91949 3.0755Z" fill="#7A7A7A" />
                                    </svg>
                                </button>
                            </div>`;
            $fileList.append(fileEl);
        };
        reader.readAsDataURL(file);
    }

    $('#profilePicture').change(function () {
        const file = this.files[0];
        const $profileThumb = $(this).closest('.my-profile').find('.my-profile__thumb');

        if (file) {
            $profileThumb.empty();
            const reader = new FileReader();
            reader.onload = function (e) {
                const picture = `<img src="${e.target.result}">`;
                $profileThumb.append(picture);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#removeProfilePicture').click(function () {
        const $profile = $(this).closest('.my-profile');
        const $input = $profile.find('#profilePicture');
        const $thumb = $profile.find('.my-profile__thumb');
        const src = $thumb.data('src');

        $thumb.find('img').attr('src', src);
        $input.val('');
    });

    $.showFormContent = function (contentId) {
        $('.my-form__content').removeClass('my-form__content--show');
        $(`#${contentId}`).addClass('my-form__content--show');
    };

    $('#showContentNewPost').click(function () {
        $.showFormContent('formContentNewPost');
    });

    // $('#showContentAccountSetup').click(function () {
    //     $.showFormContent('formContentAccountSetup');
    // });

    // $('#sharePost').click(function () {
    //     $('#modalOTP').modal('show');
    //     $.showCountdown(true);
    //     // After OTP
    //     $('#modalAlertSharePost').modal('show');
    // });

    const switchAccountType = (type) => {
        const $formItemsForBusiness = $('.my-form__item--for-business');

        if (type === 'business') {
            $formItemsForBusiness.show();
        } else {
            $formItemsForBusiness.hide();
        }
    };

    const initialType = $('.my-form__item--account .my-form__control__option--selected').data('for');
    switchAccountType(initialType);

    $('.my-form__item--account .my-form__control__option').click(function () {
        const type = $(this).data("for");
        switchAccountType(type);
    });

    $('.my-post__actions__header').click(function (e) {
        e.preventDefault()
        e.stopPropagation();
        const $this = $(this);
        const $currentAction = $this.closest('.my-post__actions');
        const $activeActions = $('.my-post__actions--show').not($currentAction);
        $activeActions.removeClass('my-post__actions--show');
        $currentAction.toggleClass('my-post__actions--show');
    });

    $('#btnLogout').click(function () {
        $('#modalAlertLogout').modal('show');
    });

    $('.my-payment__option').click(function () {
        const $this = $(this);
        const $options = $('.my-payment__option');
        const value = $this.data('value');
        $options.removeClass('my-payment__option--selected');
        $this.addClass('my-payment__option--selected');
        $this.closest('.my-form__item').find('#payAmount').val(value).trigger('change').end();
    });

    $('.my-form--balance #payAmount').on('input', function () {
        const value = $(this).val();

        $('.my-payment__option').removeClass('my-payment__option--selected').filter(function () {
            return $(this).data('value') == value;
        }).addClass('my-payment__option--selected');
    });

    // Fancy Box
    Fancybox.bind('[data-fancybox]', {});

    Fancybox.bind("[data-fancybox='gallery']", {});

})(jQuery)
