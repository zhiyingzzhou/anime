import anime from '../../src/index.js';

function fitToScreen(el, margins) {
  var elWidth = el.offsetWidth;
  var screenWidth = window.innerWidth;
  var limitWidth = screenWidth - margins;
  if (elWidth > limitWidth) {
    var scaleRatio = limitWidth / elWidth;
    anime.set(el, { scale: scaleRatio });
  }
}

var logoAnimation = (function() {

  function getPathDuration(el, speed) {
    return anime.setDashoffset(el) * speed;
  }

  var logoAnimationEl = document.querySelector('.logo-animation');
  var bouncePath = anime.path('.bounce path');
  var sphereEl = document.querySelector('.sphere');
  var spherePathEls = logoAnimationEl.querySelectorAll('.sphere path');
  var lineEls = document.querySelectorAll('.line');

  fitToScreen(logoAnimationEl, 64);

  anime.set('.fill', {opacity: 0});
  anime.set(['.letter-a', '.letter-n', '.letter-i'], {translateX: 56});
  anime.set('.letter-e', {translateX: -56});
  anime.set('.dot', {
    translateX: 448,
    translateY: -100
  });
  anime.set('.sphere path', {opacity: 0});

  function sphereAnimation() {

    anime({
      targets: '.sphere path',
      opacity: 1,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 550,
      easing: 'easeInOutCirc',
      delay:  function(el, i) {
        return i * 35
      },
      begin: function() {
        document.body.classList.add('intro-played');
      },
      complete: function() {
        sphereEl.classList.add('is-blurred');
        // anime({
        //   targets: '#blur feGaussianBlur',
        //   stdDeviation: [
        //     {value: [0, 20], duration: 500, easing: 'easeOutSine'},
        //     {value: 10, duration: 500, easing: 'easeInOutSine'}
        //   ]
        // });
      }
    });

    var pathLength = spherePathEls.length;

    var aimations = [];

    for (var i = 0; i < pathLength; i++) {
      aimations.push(anime({
        targets: spherePathEls[i],
        strokeWidth: [4, 16],
        translateX: [-10, 10],
        translateY: [-10, 10],
        easing: 'easeOutSine',
        delay: 150,
        duration: 1500,
        autoplay: false
      }))
    }

    anime({
      update: function(ins) {
        for (var i = 0; i < pathLength; i++) {
          var animation = aimations[i];
          var percent = (1 - Math.sin((i * .25) + (.0017 * ins.currentTime))) / 2;
          animation.seek(animation.duration * percent);
        }
      },
      duration: Infinity
    });

  }

  // anime.speed = .2;

  var logoAnimationTL = anime.timeline({
    easing: 'easeOutSine',
    autoplay: false
  });

  logoAnimationTL
  .add({
    targets: '.bounced',
    stroke: { value: ['#5EF3FB', '#5A87FF'], duration: 400 },
    transformOrigin: ['50% 100% 0px', '50% 100% 0px'],
    translateY: [
      {
        value: function(el) { return el.classList.contains('i-dot') ? [0, 20] : [128, -96] },
        duration: 200, endDelay: 20, easing: 'cubicBezier(0.225, 1, 0.915, 0.980)'
      },
      {value: 4, duration: 120, easing: 'easeInQuad'},
      {value: 0, duration: 120, easing: 'easeOutQuad'}
    ],
    scaleX: [
      {value: [.75, .85], duration: 190, easing: 'easeOutSine'},
      {value: 1.076, duration: 120, delay: 85, easing: 'easeInOutSine'},
      {value: 1, duration: 160, delay: 25, easing: 'easeOutQuad'}
    ],
    scaleY: [
      {value: [.8, 1.3], duration: 120, easing: 'easeOutSine'},
      {value: .7, duration: 120, delay: 180, easing: 'easeInOutSine'},
      {value: 1, duration: 180, delay: 25, easing: 'easeOutQuad'}
    ],
    translateZ: [0, 0],
    delay: function(el, i) { return (i > 2 ? (i - 1) : i) * 40 }
  }, '+=300')
  .add({
    targets: '.dot',
    easing: 'cubicBezier(0.350, 0.560, 0.305, 1)',
    duration: 380,
    translateY: 268,
    translateZ: 0,
    scaleY: [4, .7],
    scaleX: { value: 1.3, delay: 100, duration: 200},
  }, '-=490')
  .add({
    targets: '.letter-m .line',
    easing: 'easeOutElastic(1, .8)',
    duration: 600,
    d: function(el) { return el.dataset.d2 }
  }, '-=290')
  .add({
    targets: ['.letter-a', '.letter-n', '.letter-i'],
    translateX: 0,
    easing: 'easeOutElastic(1, .8)',
    duration: 800,
    delay: function(el, i, t) { return (t - i) * 20 }
  }, '-=600')
  .add({
    targets: '.letter-e',
    translateX: 0,
    easing: 'easeOutElastic(.8, .7)',
    duration: 800,
  }, '-=840')
  .add({
    targets: '.dot',
    translateX: bouncePath('x'),
    translateY: bouncePath('y'),
    translateZ: 0,
    rotate: 360,
    scaleX: [
      { value: 1, duration: 50, easing: 'easeOutSine' }
    ],
    scaleY: [
      { value: [1, 1.5], duration: 50, easing: 'easeInSine' },
      { value: 1, duration: 50, easing: 'easeOutExpo' }
    ],
    easing: 'cubicBezier(0, .74, 1, .255)',
    duration: 800,
  }, '-=660')
  .add({
    targets: '.letter-i rect',
    opacity: 0,
    duration: 1,
  })
  .add({
    targets: '.dot',
    scaleY: 1,
    scaleX: 1,
    translateY: [
      {value: 262, duration: 100, easing: 'easeOutSine'},
      {value: 244, duration: 1000, easing: 'easeOutElastic(1, .8)'}
    ],
  })
  .add({
    targets: '.letter-m .line',
    easing: 'spring(.2, 200, 3, 60)',
    d: function(el) { return el.dataset.d3 }
  }, '-=1904')
  .add({
    targets: ['.letter-i .fill', '.letter-n .fill', '.letter-m .fill', '.letter-a .fill', '.letter-e .fill'],
    opacity: { value: [0, 1], duration: 1},
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: function(el) { return getPathDuration(el, 1.5) },
    easing: 'cubicBezier(0.400, 0.530, 0.070, 1)',
    delay: function(el, i) { return Math.round(i / 2) * 150 }
  }, '-=1100')
  .add({
    targets: '.letter-i .line',
    strokeDashoffset: anime.setDashoffset,
    duration: 200,
  }, '-=1100')
  .add({
    targets: ['.letter-i', '.letter-n', '.letter-m', '.letter-a', '.letter-e'],
    translateY: [
      {value: 25, duration: 150},
      {value: 0, duration: 800, easing: 'easeOutElastic(1, .6)'}
    ],
    strokeDashoffset: [anime.setDashoffset, 0],
    delay: function(el, i) { return Math.round(i / 2) * 30 }
  }, '-=1100')
  .add({
    targets: ['.anime-logo h2'],
    translateY: [-20, 0],
    opacity: 1,
    easing: 'easeOutElastic(1, .6)',
    duration: 1000,
  }, '-=1010')
  .add({
    duration: 1000,
    delay: 500,
    begin: sphereAnimation
  }, '-=1000');

  logoAnimationEl.classList.add('is-visible');

  return logoAnimationTL;

})();

logoAnimation.play();