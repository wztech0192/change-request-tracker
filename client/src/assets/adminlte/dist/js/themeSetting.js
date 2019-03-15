/* eslint-disable no-alert */
/* eslint-disable curly */
/* eslint-disable func-names */
/* eslint-disable no-else-return */
/* eslint-disable eqeqeq */
/* eslint-disable space-before-function-paren */
/* eslint-disable consistent-return */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable semi */
/* eslint-disable no-undef */
/* eslint-disable strict */
/* eslint-disable indent */
/**
 * AdminLTE Demo Menu
 * ------------------
 * You should not use this file in production.
 * This file is for demo purposes only.
 */
$(() => {
  'use strict';

  /**
   * Get access to plugins
   */

  // eslint-disable-next-line semi
  $('[data-toggle="control-sidebar"]').controlSidebar();
  $('[data-toggle="push-menu"]').pushMenu();
  var $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu');
  var $controlSidebar = $('[data-toggle="control-sidebar"]').data(
    'lte.controlsidebar'
  );
  var $layout = $('body').data('lte.layout');
  $(window).on('load', () => {
    // Reinitialize variables on load
    $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu');
    $controlSidebar = $('[data-toggle="control-sidebar"]').data(
      'lte.controlsidebar'
    );
    $layout = $('body').data('lte.layout');
  });

  /**
   * List of all the available skins
   *
   * @type Array
   */
  var mySkins = [
    'skin-blue',
    'skin-black',
    'skin-red',
    'skin-yellow',
    'skin-purple',
    'skin-green',
    'skin-blue-light',
    'skin-black-light',
    'skin-red-light',
    'skin-yellow-light',
    'skin-purple-light',
    'skin-green-light'
  ];

  /**
   * Get a prestored setting
   *
   * @param String name Name of of the setting
   * @returns String The value of the setting | null
   */
  function get(name) {
    if (typeof Storage !== 'undefined') {
      return localStorage.getItem(name);
    } else {
      window.alert(
        'Please use a modern browser to properly view this template!'
      );
    }
  }

  /**
   * Store a new settings in the browser
   *
   * @param String name Name of the setting
   * @param String val Value of the setting
   * @returns void
   */
  function store(name, val) {
    if (typeof Storage !== 'undefined') {
      localStorage.setItem(name, val);
    } else {
      window.alert(
        'Please use a modern browser to properly view this template!'
      );
    }
  }

  /**
   * Toggles layout classes
   *
   * @param String cls the layout class to toggle
   * @returns void
   */
  function changeLayout(cls) {
    $('body').toggleClass(cls);
    $layout.fixSidebar();

    if (cls === 'fixed') {
      if ($('body').hasClass('fixed')) {
        store('fixed', 'fixed');
        $pushMenu.expandOnHover();
        $layout.activate();
      } else {
        store('fixed', '');
      }
    }
    $controlSidebar.fix();
  }

  /**
   * Replaces the old skin with the new skin
   * @param String cls the new skin class
   * @returns Boolean false to prevent link's default action
   */
  function changeSkin(cls) {
    $.each(mySkins, (i) => {
      $('body').removeClass(mySkins[i]);
    });

    $('body').addClass(cls);
    store('skin', cls);
    return false;
  }

  /**
   * Retrieve default settings and apply them to the template
   *
   * @returns void
   */
  function setup() {
    var tmp = get('skin');
    if (tmp && $.inArray(tmp, mySkins)) changeSkin(tmp);

    // Add the change skin listener
    $('[data-skin]').on('click', function(e) {
      if ($(this).hasClass('knob')) return;
      e.preventDefault();
      changeSkin($(this).data('skin'));
    });

    // Add the layout manager
    $('[data-layout]').on('click', function() {
      changeLayout($(this).data('layout'));
    });

    $('[data-controlsidebar]').on('click', function() {
      changeLayout($(this).data('controlsidebar'));
      var slide = !$controlSidebar.options.slide;

      $controlSidebar.options.slide = slide;
      if (!slide) $('.control-sidebar').removeClass('control-sidebar-open');
    });

    $('[data-sidebarskin="toggle"]').on('click', () => {
      var $sidebar = $('.control-sidebar');
      if ($sidebar.hasClass('control-sidebar-dark')) {
        $sidebar.removeClass('control-sidebar-dark');
        $sidebar.addClass('control-sidebar-light');
      } else {
        $sidebar.removeClass('control-sidebar-light');
        $sidebar.addClass('control-sidebar-dark');
      }
    });

    $('[data-enable="expandOnHover"]').on('click', function() {
      $(this).attr('disabled', true);
      $pushMenu.expandOnHover();
      if (!$('body').hasClass('sidebar-collapse')) $('[data-layout="sidebar-collapse"]').click();
    });

    console.log(get('fixed'));
    if (get('fixed') === 'fixed') {
      $('body').toggleClass('fixed');
    }
    //  Reset options
    if ($('body').hasClass('fixed')) {
      $('[data-layout="fixed"]').attr('checked', 'checked');
    }
    if ($('body').hasClass('layout-boxed')) {
      $('[data-layout="layout-boxed"]').attr('checked', 'checked');
    }
    if ($('body').hasClass('sidebar-collapse')) {
      $('[data-layout="sidebar-collapse"]').attr('checked', 'checked');
    }
  }

  setup();
});
