(function($) {
  "use strict";
  var is_scroll = false;
  var is_resize = false;
  var myscroll, myresize;

  //Run function when document ready
  $(document).ready(function() {
    init_full_height();
    init_pageloader();
    init_typed();
    init_menu_toggle();
    init_inner_link();
    init_chart_circle();
    init_contact_form();
    init_portfolio_details();
  });

  //Run function when window on scroll
  $(window).on("scroll", function() {
    init_scroll();
    is_scroll = true;
    clearTimeout(myscroll);
    myscroll = setTimeout(function() {
      is_scroll = false;
      init_update_uikit();
    }, 300);
  });

  //Run function when window on resize
  $(window).on("resize", function() {
    is_resize = true;
    clearTimeout(myresize);
    myresize = setTimeout(function() {
      is_resize = false;
      init_full_height();
      init_scroll();
    }, 300);
  });

  //============================================
  //initial functions
  //============================================

  function init_chart_circle() {
    $(".circle-progress").each(function(i, el) {
      var $el = $(el);
      $($el).circleProgress({
        value: $el.data("value")
      });
    });
  }

  function init_update_uikit() {
    //sometimes sticky nav oveflow
    if (!is_scroll) {
      if ($("#resume-nav-wrapper").length) {
        UIkit.update($("#resume-nav-wrapper"), "update");
      }

      if ($("#portfolio-nav-wrapper").length) {
        UIkit.update($("#portfolio-nav-wrapper"), "update");
      }
    }
  }

  function init_menu_toggle() {
    $(".yb-menu-togggle").on("click", function() {
      $("#body-app").toggleClass("yb-menu-open");
    });

    $("#btn-menu-toggle").on("click", function() {
      $("#main-menu").toggleClass("open-menu");
      return false;
    });

    $("#menucollapse .uk-navbar-nav a").on("click", function() {
      $("#main-menu").toggleClass("open-menu");
    });
  }

  function init_scroll() {
    if (!is_resize) {
      var window_height =
        $("#main-header").height() - ($("#main-menu").height() + 1);
      var current_scroll = Math.round($(window).scrollTop());
      if (current_scroll >= window_height) {
        $("#main-menu").addClass("fixed");
      } else {
        $("#main-menu").removeClass("fixed");
      }
    }
  }

  function init_full_height() {
    if (!is_resize) {
      let vh = window.innerHeight * 0.01;
      $(":root").css("--vh", vh + "px");
    }
  }

  function init_pageloader() {
    var $pageloader = $("#pageloader");
    setTimeout(function() { 
      $pageloader.addClass("uk-transition-fade");
      setTimeout(function() {
        $pageloader.addClass("page-is-loaded");
        init_check_hash_url();
      }, 400);
    }, 300);
  }

  function init_inner_link() {
    $(".yb-inner-link").on("click", function() {
      var $el = $(this).attr("href");
      var ofsset = parseInt($(this).attr("data-offset"));
      if ($($el).length) {
        ofsset = ofsset > 0 ? ofsset : 79;
        init_scroll_to($($el), 1500, ofsset);
        return false;
      }
    });
  }

  function init_check_hash_url() {
    if (window.location.hash && window.location.hash !="" && $(window.location.hash).length) {
      var speed = window.location.hash == "#home" ? 0 : 700;
      console.log(window.location.hash)
      init_scroll_to($(window.location.hash), speed, 79);
    }
  }

  function init_scroll_to($el, speed, offset) {
    $("html, body").animate(
      {
        scrollTop: $el.offset().top - offset
      },
      {
        duration: speed,
        easing: "easeInOutExpo"
      }
    );
  }

  function init_typed() {
    var $typed = $("#typed");
    if ($typed.length) {
      var typed = new Typed("#typed", {
        strings: ["Motion Graphic Designer", "Digital Designer", "UI/UX Developer", "Full-Stack Developer"],
        loop: true,
        typeSpeed: 70
      });
    }
  }

  function init_contact_form() {
    var $el = $("#contact-form");
    var $alert_wrap = $("#contact-form-alert");
     
    if ($el.length && $alert_wrap.length) {
      $el.on("submit", function() {
        var $btn = $("#btn-contact-form");
        var params = $el.serialize();

        init_btn_loading($btn, true);

        
        $.post("src/php/sendmail.php", params, function(data) {
          var dt = JSON.parse(data);
          if (dt.status == "error") {
            var alert = init_alert(
              "contact-alert-err",
              dt.status_desc,
              "uk-alert-danger",
              "warning"
            );
          } else {
            var alert = init_alert(
              "contact-alert-success",
              dt.status_desc,
              "uk-alert-primary",
              "info"
            );
            $el.trigger("reset");
          }
          $.each(dt.error_msg, function(key, value) {
            if (value == "") {
              $("#" + key).removeClass("uk-form-danger");
            } else {
              $("#" + key).addClass("uk-form-danger");
            }
            $("#" + key + "_error").html(value);
          });
          $alert_wrap.html(alert);
          init_btn_loading($btn, false);
        });

        return false;
      });
    }
  }

  function init_btn_loading($btn, is_loading) {
    if (is_loading) {
      $btn.attr("disabled", "disabled");
      $btn.find(".btn-text-wrap").text("Please Wait . . .");
      $btn.find(".uk-icon").attr("hidden", "hidden");
      $btn.append("<div uk-spinner></div>");
    } else {
      $btn.removeAttr("disabled");
      $btn.find(".btn-text-wrap").text($btn.attr("data-textreset"));
      $btn.find(".uk-icon").removeAttr("hidden");
      $btn.find("div[uk-spinner]").remove();
    }
  }

  function init_alert(id, msg, classname, icon) {
    var alert =
      '<div id="' +
      id +
      '" class="' +
      classname +
      '  uk-border-rounded" data-uk-alert>' +
      '<a class="uk-alert-close" data-uk-close></a>' +
      '<div class="uk-flex uk-flex-middle">' +
      '<div><span data-uk-icon="' +
      icon +
      '" class="uk-margin-small-right"></span></div>' +
      "<div>" +
      msg +
      "</div>" +
      "</div>" +
      "</div>";
    return alert;
  }

  function init_portfolio_details() { 
    $(".show-portfolio").on("click", function() {
      var $this = $(this);
      var $el = $("#show-portofolio-details");
      var $wrap = $("#portofolio-details");
      $wrap.addClass('uk-animation-toggle');
      UIkit.modal($el).show();

      //show loading first
      $wrap.html(
        '<div class="uk-position-center  uk-text-center">' +
          "<div data-uk-spinner></div> " +
        "</div>"
      ); 
      
      $.post($this.attr("href"), function(data) {
        $wrap.html(data); 
        $wrap.removeClass('uk-animation-toggle');
      });
      return false;
    });
  }
})(jQuery);


/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */

particlesJS('particles-js',
  
{
  "particles": {
    "number": {
      "value": 30,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#00FF95"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 4,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#00FF95",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 30,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}

);