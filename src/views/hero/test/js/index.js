var currentCaptchaConfig;
/** 是否打印日志 */
var isPrintLog = true;
export default {
  clearPreventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
  },

  clearAllPreventDefault($div) {
    $div.each(function (index, el) {
      el.addEventListener("touchmove", clearPreventDefault, false);
    });
  },

  reductionAllPreventDefault($div) {
    $div.each(function (index, el) {
      el.removeEventListener("touchmove", clearPreventDefault);
    });
  },
  printLog(...params) {
    if (isPrintLog) {
      console.log(JSON.stringify(params));
    }
  },

  initConfig(
    bgImageWidth,
    bgImageHeight,
    sliderImageWidth,
    sliderImageHeight,
    end
  ) {
    currentCaptchaConfig = {
      startTime: new Date(),
      trackArr: [],
      movePercent: 0,
      bgImageWidth,
      bgImageHeight,
      sliderImageWidth,
      sliderImageHeight,
      end,
    };
    this.printLog("init", currentCaptchaConfig);
    return currentCaptchaConfig;
  },

  down(event) {
    let targetTouches = event.originalEvent
      ? event.originalEvent.targetTouches
      : event.targetTouches;
    let startX = event.pageX;
    let startY = event.pageY;
    if (startX === undefined) {
      startX = Math.round(targetTouches[0].pageX);
      startY = Math.round(targetTouches[0].pageY);
    }
    currentCaptchaConfig.startX = startX;
    currentCaptchaConfig.startY = startY;

    const pageX = currentCaptchaConfig.startX;
    const pageY = currentCaptchaConfig.startY;
    const startTime = currentCaptchaConfig.startTime;
    const trackArr = currentCaptchaConfig.trackArr;
    trackArr.push({
      x: pageX - startX,
      y: pageY - startY,
      type: "down",
      t: new Date().getTime() - startTime.getTime(),
    });
    this.printLog("start", startX, startY);
    // pc
    window.addEventListener("mousemove", this.move);
    window.addEventListener("mouseup", this.up);
    // 手机端
    window.addEventListener("touchmove", this.move, false);
    window.addEventListener("touchend", this.up, false);
    doDown(currentCaptchaConfig);
  },

  move(event) {
    if (event instanceof TouchEvent) {
      event = event.touches[0];
    }
    let pageX = Math.round(event.pageX);
    let pageY = Math.round(event.pageY);
    const startX = currentCaptchaConfig.startX;
    const startY = currentCaptchaConfig.startY;
    const startTime = currentCaptchaConfig.startTime;
    const end = currentCaptchaConfig.end;
    const bgImageWidth = currentCaptchaConfig.bgImageWidth;
    const trackArr = currentCaptchaConfig.trackArr;
    let moveX = pageX - startX;
    const track = {
      x: pageX - startX,
      y: pageY - startY,
      type: "move",
      t: new Date().getTime() - startTime.getTime(),
    };
    trackArr.push(track);
    if (moveX < 0) {
      moveX = 0;
    } else if (moveX > end) {
      moveX = end;
    }
    currentCaptchaConfig.moveX = moveX;
    currentCaptchaConfig.movePercent = moveX / bgImageWidth;
    doMove(currentCaptchaConfig);
    this.printLog("move", track);
  },

  test() {
    alert(1);
  },

  up(event) {
    window.removeEventListener("mousemove", this.move);
    window.removeEventListener("mouseup", this.up);
    window.removeEventListener("touchmove", this.move);
    window.removeEventListener("touchend", this.up);
    if (event instanceof TouchEvent) {
      event = event.changedTouches[0];
    }
    currentCaptchaConfig.stopTime = new Date();
    let pageX = Math.round(event.pageX);
    let pageY = Math.round(event.pageY);
    const startX = currentCaptchaConfig.startX;
    const startY = currentCaptchaConfig.startY;
    const startTime = currentCaptchaConfig.startTime;
    const trackArr = currentCaptchaConfig.trackArr;

    const track = {
      x: pageX - startX,
      y: pageY - startY,
      type: "up",
      t: new Date().getTime() - startTime.getTime(),
    };

    trackArr.push(track);
    this.printLog("up", track);
    valid(currentCaptchaConfig);
  },
};
