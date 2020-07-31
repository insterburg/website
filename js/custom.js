(function($){
	"use strict";

	$(document).ready(function() {

		/* ---------------------------------------------- /*
		 * Initialization general scripts for all pages
		/* ---------------------------------------------- */

		var moduleHero      = $('#hero'),
			overlayMenu     = $('#overlay-menu'),
			navbar          = $('.navbar-custom'),
			modules         = $('.module-hero, .module, .module-small'),
			windowWidth     = Math.max($(window).width(), window.innerWidth),
			navbatTrans,
			mobileTest;
			

		navbarCheck(navbar);

		$(window).resize(function() {
			buildModuleHero();
			windowWidth     = Math.max($(window).width(), window.innerWidth);
		});

		$(window).scroll(function() {
			if(windowWidth > 960) {
				navbarAnimation(navbar, moduleHero);
			}
		}).scroll();

		/* ---------------------------------------------- /*
		 * Mobile detect
		/* ---------------------------------------------- */

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			mobileTest = true;
		} else {
			mobileTest = false;
		}

		/* ---------------------------------------------- /*
		 * Setting background of modules
		/* ---------------------------------------------- */

		modules.each(function() {
			if ($(this).attr('data-background')) {
				$(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
			}
		});

		/* ---------------------------------------------- /*
		 * Parallax
		/* ---------------------------------------------- */

		if (mobileTest === true) {
			$('.module-parallax').css({'background-attachment': 'scroll'});
		} else {
			$('#hero.module-parallax').parallax('50%', 0.2);
		}

		/* ---------------------------------------------- /*
		 * Full height module
		/* ---------------------------------------------- */

		function buildModuleHero() {
			if (moduleHero.length > 0) {
				if (moduleHero.hasClass('module-full-height')) {
					moduleHero.height($(window).height());
				} else {
					moduleHero.height($(window).height() * 0.85);
				}
			}
		}
		
		$(window).on('resize', function() {	}).resize();

		/* ---------------------------------------------- /*
		 * Transparent navbar animation
		/* ---------------------------------------------- */

		function navbarCheck() {
			if (navbar.length > 0 && navbar.hasClass('navbar-transparent')) {
				navbatTrans = true;
			} else {
				navbatTrans = false;
			}
		}

		function navbarAnimation(navbar, moduleHero) {
			var topScroll = $(window).scrollTop();
			if (navbar.length > 0 && navbatTrans !== false) {
				if (topScroll >= 5) {
					navbar.removeClass('navbar-transparent');
				} else {
					navbar.addClass('navbar-transparent');
				}
			}
		}

		/* ---------------------------------------------- /*
		 * Show/Hide overlay menu
		/* ---------------------------------------------- */

		$('#toggle-menu').on('click', function() {
			showMenu();
			$('body').addClass('aux-navigation-active');
			return false;
		});

		$('.overlay-menu-hide').on('click', function() {
			hideMenu();
			$('body').removeClass('aux-navigation-active');
			return false;
		});

		$(window).keydown(function(e) {
			if (overlayMenu.hasClass('active')) {
				if (e.which === 27) {
					hideMenu();
				}
			}
		});

		function showMenu() {
			navbar.animate({'opacity': 0, 'top': -80}, {
				duration: 150,
				easing: 'easeInOutQuart'
			});

			overlayMenu.addClass('active');
		}

		function hideMenu() {
			navbar.animate({'opacity': 1, 'top': 0}, {
				duration: 150,
				easing: 'easeInOutQuart'
			});

			overlayMenu.removeClass('active');
		}

		/* ---------------------------------------------- /*
		 * Overlay dropdown menu
		/* ---------------------------------------------- */

		$('#nav > li.slidedown > a').on('click', function() {
			if ($(this).attr('class') != 'active') {
				$('#nav li ul').slideUp({duration: 300, easing: 'easeInOutQuart'});
				$('#nav li a').removeClass('active');
				$(this).next().slideToggle({duration: 300, easing: 'easeInOutQuart'}).addClass('open');
				$(this).addClass('active');
			} else {
				$('#nav li ul').slideUp({duration: 300, easing: 'easeInOutQuart'}).removeClass('open');
				$(this).removeClass('active');
			}
			return false;
		});

		/* ---------------------------------------------- /*
		 * Progress bars, counters animations
		/* ---------------------------------------------- */

		$('.progress-bar').each(function(i) {
			$(this).appear(function() {
				var percent = $(this).attr('aria-valuenow');
				$(this).animate({'width' : percent + '%'});
				$(this).find('span').animate({'opacity' : 1}, 900);
				$(this).find('span').countTo({from: 0, to: percent, speed: 900, refreshInterval: 30});
			});
		});

		$('.counter-item').each(function(i) {
			$(this).appear(function() {
				var number = $(this).find('.counter-number').data('number');
				$(this).find('.counter-number span').countTo({from: 0, to: number, speed: 1200, refreshInterval: 30});
			});
		});

		/* ---------------------------------------------- /*
		 * WOW Animation
		/* ---------------------------------------------- */

		var wow = new WOW({
			mobile: false
		});

		wow.init();

		/* ---------------------------------------------- /*
		 * Scroll Animation
		/* ---------------------------------------------- */

		$('.section-scroll').bind('click', function(e) {
			var anchor = $(this);

			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top
			}, 1000);

			e.preventDefault();
		});

		/* ---------------------------------------------- /*
		 * Scroll top
		/* ---------------------------------------------- */

		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('.scroll-up').fadeIn();		
			} else {
				$('.scroll-up').fadeOut();
			}
		});

		$('a[href="#totop"]').click(function() {
			$('html, body').animate({ scrollTop: 0 }, 'slow');
			return false;
		});

	});

})(jQuery);
