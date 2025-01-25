"use strict";


$(function () {

    // init Fancybox Gallery
    if (typeof Fancybox !== "undefined" && Fancybox !== null) {
        Fancybox.bind("[data-fancybox]", {
            dragToClose: false,
            closeButton: false
        });
    }


    // Detect user Device
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 768) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }
    getNavigator();
    $(window).on('resize', () => {
        getNavigator();
    });


    // tabs

    function initTabs() {
        $('.tabs').each(function () {
            $(this).find('.tab-btn').each(function (index) {
                if (index == 0) $(this).addClass('active');
            });
            $(this).find(".tab-content").each(function (index) {
                if (index == 0) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });

        })
    }

    initTabs();

    // custom select 

    $('select').each(function () {
        var $this = $(this), numberOfOptions = $(this).children('option').length;
        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        // custom select
        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                'aria-label': $this.children('option').eq(i).val()
            }).appendTo($list);
        }
        var $listItems = $list.children('li');
        $($listItems[0]).addClass('active')
        $listItems.on("click", (function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active').addClass('selected');;
            $this.val($(this).attr('aria-label'));
            $(this).addClass('active').siblings().removeClass('active');
            $list.hide();
        }));

        $styledSelect.on("click", (function (e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function () {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        }));

        $(document).on("click", (function () {
            $styledSelect.removeClass('active');
            $list.hide();
        }));

    });


    // event handlers

    $(document).on('click', (e) => {
        let $target = $(e.target);


        // catalog
        if ($target.hasClass('catalog__btn') || (!$target[0].closest('.catalog') && $('.catalog__btn').hasClass('active'))) {
            getСatalog()
        }

        // tabs

        if ($target.hasClass('tab-btn')) {
            $target.addClass("active")
                .siblings()
                .removeClass("active")
                .closest(".tabs")
                .find(".tab-content")
                .removeClass('active')
                .eq($target.index())
                .addClass('active')
        }

        // catalog accordion on mobile
        if ($target.hasClass('catalog__product-title')) {
            $target.toggleClass('active');
            $target.next().slideToggle();
            $target.parent().siblings()
                .find('.catalog__product-title').removeClass('active').next().slideUp();
            $('.catalog__side-btn').removeClass('active');
            $('.catalog__side-btn').eq($target.parent().index()).addClass('active');
            $('.catalog__product').removeClass('active');
            $target.parent().addClass('active');

        }

        // catalog filter accordion
        if ($target.hasClass('products__sidebar-btn')) {
            $target.toggleClass('active');
            $target.next().toggleClass('active');
            $target.parent().siblings()
                .find('.products__sidebar-btn').removeClass('active').next().removeClass('active');
        }

        // catalog filter on mobile
        if ($target.hasClass('products__filter') || $target.hasClass('products__sidebar-close')
            || (!$target[0].closest('.products__sidebar') && $('.products__sidebar').hasClass('active'))) {
            $('.products__sidebar').toggleClass('active');
        }

        // search on mobile
        if ($target.hasClass('search__btn')) {
            $target.addClass('active');
            $target.next().addClass('open');
            setTimeout(() => {
                $target.next().find('input')[0].focus()
            }, 300)
        }

        // counter

        if ($target[0].closest('.product__counter')) {
            let $counter = $target.closest('.product__counter')
            let $countValue = $counter.find('.product__counter-value');
            let $countPrev = $counter.find('.product__counter-btn.decrement');
            let $countNext = $counter.find('.product__counter-btn.increment');



            if ($target[0] == $countPrev[0]) {
                if (+$countValue.text() <= 1) {
                    $countValue.text(1)
                    return;
                }
                $countValue.text(+$countValue.text() - 1);
            }

            if ($target[0] == $countNext[0]) {
                $countValue.text(+$countValue.text() + 1);
            }

        }

        // arrow top
        if ($target.hasClass('arrow-top-btn')) {
            $("html, body").animate({
                scrollTop: 0
            }, 300);
            return false;
        }

        // delete card product 
        if ($target.hasClass('cart__delete')) {
            $target.closest('.cart__order').remove();
            checkEmptyCart()
        }

        if ($target.hasClass('cart-clear')) {
            $('.cart__order').remove();
            checkEmptyCart()
        }

        if ($target.hasClass('cart-clear-selected')) {
            $('.cart__order').each(function () {

                if ($(this).find('.checkbox__input')[0].checked) {
                    $(this).remove();
                }
            })

            checkEmptyCart()
        }

    });

    $('.search__form-input').on('blur', function () {
        $('.search__btn').removeClass('active');
        $('.search__btn').next().removeClass('open');
    });


    $(window).on("scroll", function (e) {
        if (scrollY < 2 * document.documentElement.clientHeight) {
            $('.arrow-top-btn').addClass('hidden');
        } else {
            $('.arrow-top-btn').removeClass('hidden');
        }
    })


    function checkEmptyCart() {


        let $cardCategories = $('.cart__orders-list');
        $cardCategories.each(function () {
            let $cardOrders = $(this).find('.cart__order');
            if ($cardOrders.length == 0) {
                $(this).prev().remove()
            }
        });


        if ($('.cart__order').length == 0) {
            $('.cart__orders').html('<div class="cart__orders-empty">Корзина пуста</div>')
        }

    }

    function getСatalog() {
        $('.catalog__btn').toggleClass('active');
        $('.catalog__body').fadeToggle();
    }


    // Input type="tel" Mask


    if ($('input[type="tel"]').length > 0) {
        $('input[type="tel"]').each(function (idx, input) {

            const cyrillicCountries = ['AM', 'AZ', 'BY', 'GE', 'KZ', 'KG', 'MD', 'RU', 'TJ', 'TM', 'UZ',];

            const iti = intlTelInput(input, {
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
                initialCountry: "ru",
                onlyCountries: cyrillicCountries,
                preferredCountries: ['ru'],
                autoPlaceholder: false,
            });


            function setMask() {
                const mask = getFormattedNumber("9");
                const formattedExampleNumber = getFormattedNumber();

                $(input).inputmask('remove');
                $(input).inputmask({
                    "mask": mask,
                    showMaskOnHover: false,
                })

                $(input).attr('placeholder', formattedExampleNumber);

                $(input).on('blur', function () {
                    $(input).attr('placeholder', formattedExampleNumber);
                })

            }

            function getFormattedNumber(symbol = "_") {
                const countryData = iti.getSelectedCountryData();


                const dialCode = symbol == '9' ? countryData.dialCode.replace(/./g, '\\$&') : countryData.dialCode;

                const exampleNumber = intlTelInputUtils.getExampleNumber(
                    countryData.iso2,
                    false,
                    intlTelInputUtils.numberFormat.INTERNATIONAL
                );

                const numberWithoutDialCode = exampleNumber.replace(/^\+\d{1,3}/, '');
                const formattedNumber = numberWithoutDialCode.replace(/\d/g, symbol);

                return `+${dialCode}${formattedNumber}`;
            }


            $(input).on('countrychange', function () {
                setMask();
            });

            iti.promise.then(function () {
                setMask();
            });


        });
    }





    // sliders 

    if ($('.partners__list').length > 0) {
        new Swiper('.partners__list', {
            slidesPerView: 2,
            spaceBetween: 20,
            navigation: {
                nextEl: ".partners__next",
                prevEl: ".partners__prev"
            },
            breakpoints: {
                479.98: {
                    slidesPerView: 3,
                },
                991.98: {
                    slidesPerView: 5,
                }
            }

        });


    }





});


