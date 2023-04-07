<template>
  <div class="slider" @click.prevent="">
    <div class="content">
      <div class="slider-img-div" id="slider-img-div">
        <img id="slider-img" src="" alt />
      </div>
      <div class="bg-img-div"></div>
    </div>
    <div class="slider-move">
      <div class="slider-move-track">拖动滑块完成拼图</div>
      <div
        class="slider-move-btn"
        id="slider-move-btn"
        @mousedown.prevent="thisDown($event)"
      ></div>
    </div>
    <div class="bottom">
      <div class="close-btn" id="slider-close-btn"></div>
      <div class="refresh-btn" id="slider-refresh-btn"></div>
    </div>
  </div>
</template>

<script>
import minJs from "./js/index";
import $, { event } from "jquery";
import http from "@/utils/request";
export default {
  name: "test1",
  components: {},
  data() {
    return {
        currentCaptchaId:""
    };
  },
  mounted() {
    this.refreshCaptcha();
    // this.test2()
  },
  methods: {
    thisDown(event){
        minJs.down(event)
        window.removeEventListener('touchmove', function(e) {
        _this.move(e)
      })
    },
    async test2(){
        var data = await http.get("/gen?type=CONCAT");
        console.log(data)
    },
    async refreshCaptcha() {
      var data = await http.get("/gen?type=CONCAT");
      data = data.data;
      this.reset();
      this.currentCaptchaId = data.id;
      const bgImg = $(".bg-img-div");
      const sliderImg = $(".slider-img-div");
      bgImg.css(
        "background-image",
        "url(" + data.captcha.backgroundImage + ")"
      );
     
      sliderImg.css(
        "background-image",
        "url(" + data.captcha.backgroundImage + ")"
      );
      sliderImg.css("background-position", "0px 0px");
      var backgroundImageHeight = data.captcha.backgroundImageHeight;
      var height =
        ((backgroundImageHeight - data.captcha.data) / backgroundImageHeight) *
        159;
      $(".slider-img-div").css("height", height);
      minJs.initConfig(
        bgImg.width(),
        bgImg.height(),
        sliderImg.width(),
        sliderImg.height(),
        206
      );
    },
    reset() {
      $("#slider-move-btn").css("background-position", "-5px 11.79625%");
      $("#slider-move-btn").css("transform", "translate(0px, 0px)");
      $("#slider-img-div").css("transform", "translate(0px, 0px)");
      this.currentCaptchaId = null;
    },
    valid(captchaConfig) {
      let data = {
        bgImageWidth: captchaConfig.bgImageWidth,
        bgImageHeight: captchaConfig.bgImageHeight,
        sliderImageWidth: captchaConfig.sliderImageWidth,
        sliderImageHeight: captchaConfig.sliderImageHeight,
        startSlidingTime: captchaConfig.startTime,
        entSlidingTime: captchaConfig.stopTime,
        trackList: captchaConfig.trackArr,
      };
     
    },
    doMove(config) {
      const moveX = config.moveX;
      $("#slider-move-btn").css("transform", "translate(" + moveX + "px, 0px)");
      $("#slider-img-div").css("background-position-x", moveX + "px");
    },
    doDown() {
      $("#slider-move-btn").css("background-position", "-5px 31.0092%");
    },
  },
};
</script>


    <style>
.slider {
  background-color: #fff;
  width: 278px;
  height: 285px;
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
}

.slider .content {
  width: 100%;
  height: 159px;
  position: relative;
}

.bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
  background-size: 100% 159px;
  background-image: none;
  background-position: 0 0;
  z-index: 0;
}

.slider-img-div {
  height: 100%;
  width: 100%;
  background-size: 100% 159px;
  position: absolute;
  transform: translate(0px, 0px);
  /*border-bottom: 1px solid blue;*/
  z-index: 1;
}

.bg-img-div img {
  width: 100%;
}

.slider-img-div img {
  height: 100%;
}

.slider .slider-move {
  height: 60px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.slider .bottom {
  height: 19px;
  width: 100%;
}

.refresh-btn,
.close-btn,
.slider-move-track,
.slider-move-btn {
  background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png)
    no-repeat;
}

.refresh-btn,
.close-btn {
  display: inline-block;
}

.slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.slider {
  user-select: none;
}

.slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.slider-move-btn:hover,
.close-btn:hover,
.refresh-btn:hover {
  cursor: pointer;
}

.bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
}
</style>