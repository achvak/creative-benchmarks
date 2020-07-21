(function (window, undefined) {
    function sliderModule(slider, navigation) {
        var slider = document.querySelector(slider);
        var slides;
        var currentSlide = 1;
        var currentPosition = 0;
        if(window.location.hash) {
            currentSlide = window.location.hash.split('_')[1];

        }
        var sliderWidth = 0;
        var navigation = document.querySelector(navigation);
        var navigationItem = navigation.querySelectorAll('li');
        var slidesCount = 0;

        var sliderWrapper;
        // var preventStickScroll = false;

        function addSliderWrapper() {
            slider.innerHTML = '<div class="slidesWrapper">' + slider.innerHTML + '</div>';
            sliderWrapper = slider.querySelector('.slidesWrapper');
            slides = slider.querySelectorAll('.slide');
            slidesCount = slides.length;
            setSliderWidth();
        }

        function setSliderWidth() {
            slider.querySelector('.slidesWrapper').style.width = slider.offsetWidth * slidesCount + 'px';
            sliderWidth = slider.offsetWidth;
            slides.forEach(function (item) {
                item.style.width = slider.offsetWidth + 'px';
            })

        }

        function setActiveNavItem() {
            navigationItem.forEach(function (item) {
                item.classList.remove('active');
                if(item.dataset.id == currentSlide) item.classList.add('active');
            })
        }

        function setActiveSlide() {
            slides.forEach(function (slide) {
                slide.classList.remove('active');
                if(slide.id == 'sl_' + currentSlide) slide.classList.add('active');
            })
            currentPosition = sliderWidth * (currentSlide - 1) * -1;
            console.log(currentPosition);
            changeSlide();
        }

        function setNavigationHandler() {
            navigationItem.forEach(function (item) {
                item.addEventListener('click', changeSlide);
            })
        }

        function changeSlide(e) {
            var nextSlide = (e) ? e.target.dataset.id : currentSlide;
            if(nextSlide == currentSlide && e) return;
            var moveTo = currentPosition - (nextSlide - currentSlide) * sliderWidth;
            sliderWrapper.style.transform = 'translate3d(' + moveTo + 'px, 0px, 0px)';
            currentSlide = nextSlide;
            setActiveNavItem();
            currentPosition = moveTo;
        }


        function verticalNavigation() {
            var menu = document.querySelector('.verticalNav');
            function navigationHandler() {
                var li = menu.querySelectorAll('li');
                li.forEach(function (item) {
                    item.addEventListener('click', function (e) {
                        preventStickScroll = true;
                        if(e.target.classList.contains('active')) return;
                        li.forEach(function (item) {
                            item.classList.remove('active');
                        })
                        e.target.classList.add('active');

                        var fromTop = slider.querySelector('.slide-section[data-menu=' + item.dataset.target + ']' ).offsetTop;
                        window.scrollTo({
                            top: fromTop,
                            // behavior: "smooth"
                        });
                        preventStickScroll = false;
                        // window.scrollTo({
                        //     top: fromTop,
                        //     behavior: "smooth"
                        // });

                        // window.onscroll = function(e) {
                        //     var currentScrollOffset = window.pageYOffset || document.documentElement.scrollTop
                        //     if (currentScrollOffset === fromTop) {
                        //         preventStickScroll = false;
                        //         window.onscroll = null // remove listener
                        //     }
                        // }
                    })
                })
            }
            navigationHandler();
            function init() {
                navigationHandler();

            }

            return {
                init: init
            }
        }

        function scrollHandler() {
            var slideMap = [];
            var leftMenu = document.querySelector('.verticalNav');
            function builDOMMap() {
                var slideSection = slider.querySelectorAll('.slide:first-child .slide-section');
                slideSection.forEach(function (item, index) {
                    if(index == 0 && pageYOffset == 0) item.classList.add('active');
                    // var middle = (item.getBoundingClientRect().top + item.getBoundingClientRect().bottom) / 2;
                    var middle = item.offsetTop + (item.offsetHeight / 2);
                    slideMap.push({'slideSection': '.slide:first-child .slide-section:nth-child('+ parseInt(index + 1) +')', 'pinPoint': middle});
                })
            }
            function setActiveMenu(active) {
                leftMenu.querySelectorAll('li').forEach(function (item) {
                    item.classList.remove('active');
                })
                leftMenu.querySelector('li[data-target='+active+']').classList.add('active');
            }

            function stickToSection() {
                var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
                var prevTopPosition = 0;
                // var prevTopPosition = window.scrollY;
                // smoothScroll();
                window.addEventListener('scroll', function () {
                    // if(preventStickScroll) return;
                    smoothScroll();

                });

                function smoothScroll() {
                    var scrollTop = window.scrollY;

                    var preventScroll = true;
                    var scrollTopModifyed = scrollTop;
                    if(prevTopPosition - scrollTop < 0) scrollTopModifyed += windowHeight;
                    prevTopPosition = scrollTop;
                    slideMap.forEach(function (item) {
                        if(scrollTopModifyed < item.pinPoint + 100 && scrollTopModifyed > item.pinPoint - 100) {
                            var section = document.querySelector(item.slideSection);
                            if(!section.classList.contains('active')) {
                                slider.querySelectorAll('.slide:first-child .slide-section').forEach(function (sections) {
                                    sections.classList.remove('active');
                                })
                                section.classList.add('active');
                                preventScroll = false
                            }
                            if(section.classList.contains('active') && !preventScroll) {
                                // window.scrollTo({
                                //     top: parseInt(section.getBoundingClientRect().top + scrollTop),
                                //     behavior: "smooth"
                                // });
                                setActiveMenu(section.dataset.menu)
                                preventScroll = true;
                            }
                        }
                    })
                }
            }




            function init() {
                builDOMMap();
                stickToSection();

            }

            return {
                init: init
            }
        }


        function init() {
            scrollHandler().init();
            addSliderWrapper();
            setActiveNavItem();

            verticalNavigation().init();

            setActiveSlide();
            setNavigationHandler();
            // document.addEventListener('keydown', function (e) {
            //     console.log(e.key);
            //     switch (e.key) {
            //         case 'ArrowRight':
            //             currentSlide -= 1;
            //         case 'ArrowLeft':
            //             currentSlide += 1;
            //     }
            //     console.log(currentSlide);
            //     if(e.key == 'ArrowRight' || e.key == 'ArrowLeft') changeSlide();
            //
            // });
        }
        return {
            init: init
        }
    }


    window.onload = function () {
        sliderModule('.slider', '.slides').init();
    }

})(window, undefined)