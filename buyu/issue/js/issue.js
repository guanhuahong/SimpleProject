(function() {
    var questions = document.querySelectorAll(".issue-question");
    var asks = document.querySelectorAll(".issue-ask");
    var clickStatus = false;

    function readyClick() {
        clickStatus = true;
    }

    function cancelClick() {
        clickStatus = false;
    }

    function easeNone(k) {
        return k;
    }

    function easeOutCubic(k) {
        return --k * k * k + 1;
    }

    var question = questions[0];
    var questionHeight = question.offsetHeight;
    var FPS = 16.6667;
    var animationStatus = false;

    function animationEnd() {
        animationStatus = false;
    }

    function animationStart() {
        animationStatus = true;
    }

    function animationStop() {
        window.clearInterval(animationStatus);
        animationStatus = false;
    }

    function scrollTo(el, scrollTop, duration, ease) {
        var _duration = 500;
        if (typeof duration === "function") {
            _duration = duration(scrollTop);
        } else if (typeof duration === "number") {
            _duration = duration;
        }
        if (typeof ease !== "function") {
            ease = easeNone;
        }
        var _startTime = +new Date();
        var start = el.scrollTop;
        var end = scrollTop;
        var timer = null;

        function to() {
            var now = +new Date();
            var elapsed = (now - _startTime) / _duration;
            elapsed = elapsed > 1 ? 1 : elapsed;
            var val = ease(elapsed);
            var _st = start + (end - start) * val;
            el.scrollTop = _st;
            if (_st >= scrollTop) {
                animationEnd();
                window.clearInterval(timer);
                timer = null;
            }
        }
        timer = window.setInterval(to, FPS);
        animationStart(timer);
    }
    var section = document.querySelector(".section-wrap-body");
    var scrollHeight = section.scrollHeight;

    function resetScroll(ask) {
        var offsetTop = ask.offsetTop;
        var askHeight = ask.offsetHeight;
        var scrollTop = section.scrollTop;
        var sectionHeight = section.offsetHeight;
        var outside = scrollTop + sectionHeight;
        var maxScrollTop = offsetTop + askHeight + 28;

        function duration(to) {
            if (Math.abs(to - scrollTop) < sectionHeight / 2) {
                return 200;
            } else {
                return 500;
            }
        }
        if (animationStatus) {
            animationStop();
        }
        if (questionHeight + askHeight > sectionHeight) {
            scrollTo(section, offsetTop - questionHeight, duration, easeOutCubic);
        } else if (maxScrollTop > outside) {
            scrollTo(section, maxScrollTop - sectionHeight, duration, easeOutCubic)
        }

    }

    function openAsk(index, ev) {
        if (!clickStatus) return;
        var ask = asks[index];
        if (ask.className.match(/\sactive/)) {
            ask.className = ask.className.replace(/\sactive/, "");
        } else {
            ask.className += " active";
            resetScroll(ask);
        }
    }
    questions = Array.prototype.slice.call(questions);
    document.addEventListener("touchmove", cancelClick);
    questions.map(function(el, key) {
        el.addEventListener("touchstart", readyClick);
        el.addEventListener("touchend", openAsk.bind(el, key));
    });
}());
