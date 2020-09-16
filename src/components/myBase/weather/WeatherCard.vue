<template>
  <div class="weather-card container">
    <div class="sunny" v-show="'00'==weatherIndex"></div>
    <div class="cloudy" v-show="'01'==weatherIndex ||'02'==weatherIndex || '18'==weatherIndex || '100'==weatherIndex"></div>
    <div class="rainy" v-show="'03'==weatherIndex || '07'==weatherIndex || '08'==weatherIndex || '09'==weatherIndex || '10'==weatherIndex || '11'==weatherIndex || '12'==weatherIndex || '19'==weatherIndex || '21'==weatherIndex || '22'==weatherIndex || '23'==weatherIndex || '24'==weatherIndex || '25'==weatherIndex"></div>
    <div class="snowy" v-show="'13'==weatherIndex || '14'==weatherIndex || '15'==weatherIndex || '16'==weatherIndex || '17'==weatherIndex || '26'==weatherIndex || '27'==weatherIndex || '28'==weatherIndex"></div>
    <div class="stormy" v-show="'04'==weatherIndex"></div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weatherIndex: {
      type: String,
      default: '00'
    }
  }
}
</script>

<style lang="less" scoped>
.weather-card {
  position:relative;
  min-height:200px;
  // background-color: #e6e0e0;
  background-color: #cce2ff;
//   background-color: #000;
  border-radius: 6px;
}
/* SUNNY */
.sunny {
  -webkit-animation: sunny 15s linear infinite;
  animation: sunny 15s linear infinite;
  // background: -webkit-linear-gradient(
  //   top,
  //   rgba(255, 255, 255, 0) 0%,
  //   rgba(255, 255, 255, 0.8) 50%,
  //   rgba(255, 255, 255, 0) 100%
  // );
  // background: linear-gradient(
  //   top,
  //   rgba(255, 255, 255, 0) 0%,
  //   rgba(255, 255, 255, 0.8) 50%,
  //   rgba(255, 255, 255, 0) 100%
  // );
  height: 140px;
  width: 20px;
  margin-left: -15px;
  position: absolute;
  left: 140px;
  top: 0px;
}
.sunny:before {
  // background: -webkit-linear-gradient(
  //   top,
  //   rgba(255, 255, 255, 0) 0%,
  //   rgba(255, 255, 255, 0.8) 50%,
  //   rgba(255, 255, 255, 0) 100%
  // );
  // background: linear-gradient(
  //   top,
  //   rgba(255, 255, 255, 0) 0%,
  //   rgba(255, 255, 255, 0.8) 50%,
  //   rgba(255, 255, 255, 0) 100%
  // );
  content: '';
  height: 140px;
  width: 20px;
  opacity: 1;
  position: absolute;
  bottom: 0px;
  left: 0px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.sunny:after {
  background: #ffee44;
  border-radius: 50%;
  box-shadow: rgba(255, 255, 0, 0.2) 0 0 0 15px;
  content: '';
  height: 80px;
  width: 80px;
  position: absolute;
  left: -30px;
  top: 30px;
}
@-webkit-keyframes sunny {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes sunny {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* CLOUDY */
.cloudy {
  -webkit-animation: cloudy 5s ease-in-out infinite;
  animation: cloudy 5s ease-in-out infinite;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: #ffffff 65px -15px 0 -5px, #ffffff 25px -25px, #ffffff 30px 10px,
    #ffffff 60px 15px 0 -10px, #ffffff 85px 5px 0 -5px;
  height: 50px;
  width: 50px;
  margin-left: -60px;
  position: absolute;
  left: 140px;
  top: 60px;
}
.cloudy:after {
  -webkit-animation: cloudy_shadow 5s ease-in-out infinite;
  animation: cloudy_shadow 5s ease-in-out infinite;
  background: #000000;
  border-radius: 50%;
  content: '';
  height: 15px;
  width: 120px;
  opacity: 0.2;
  position: absolute;
  left: 5px;
  bottom: -60px;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
}
@-webkit-keyframes cloudy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@keyframes cloudy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@-webkit-keyframes cloudy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@keyframes cloudy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}

/* RAINY */
.rainy {
  -webkit-animation: rainy 5s ease-in-out infinite 1s;
  animation: rainy 5s ease-in-out infinite 1s;
  background: #cccccc;
  border-radius: 50%;
  box-shadow: #cccccc 65px -15px 0 -5px, #cccccc 25px -25px, #cccccc 30px 10px,
    #cccccc 60px 15px 0 -10px, #cccccc 85px 5px 0 -5px;
  display: block;
  height: 50px;
  width: 50px;
  margin-left: -60px;
  position: absolute;
  left: 140px;
  top: 50px;
}
.rainy:after {
  -webkit-animation: rainy_shadow 5s ease-in-out infinite 1s;
  animation: rainy_shadow 5s ease-in-out infinite 1s;
  background: #000000;
  border-radius: 50%;
  content: '';
  height: 15px;
  width: 120px;
  opacity: 0.2;
  position: absolute;
  left: 5px;
  bottom: -60px;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
}
.rainy:before {
  -webkit-animation: rainy_rain 0.7s infinite linear;
  animation: rainy_rain 0.7s infinite linear;
  content: '';
  background: #cccccc;
  border-radius: 50%;
  display: block;
  height: 6px;
  width: 3px;
  opacity: 0.3;
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
@-webkit-keyframes rainy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@keyframes rainy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@-webkit-keyframes rainy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@keyframes rainy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@-webkit-keyframes rainy_rain {
  0% {
    box-shadow: rgba(0, 0, 0, 0) 30px 30px, rgba(0, 0, 0, 0) 40px 40px,
      #000 50px 75px, #000 55px 50px, #000 70px 100px, #000 80px 95px,
      #000 110px 45px, #000 90px 35px;
  }
  25% {
    box-shadow: #000 30px 45px, #000 40px 60px, #000 50px 90px, #000 55px 65px,
      rgba(0, 0, 0, 0) 70px 120px, rgba(0, 0, 0, 0) 80px 120px, #000 110px 70px,
      #000 90px 60px;
  }
  26% {
    box-shadow: #000 30px 45px, #000 40px 60px, #000 50px 90px, #000 55px 65px,
      rgba(0, 0, 0, 0) 70px 40px, rgba(0, 0, 0, 0) 80px 20px, #000 110px 70px,
      #000 90px 60px;
  }
  50% {
    box-shadow: #000 30px 70px, #000 40px 80px, rgba(0, 0, 0, 0) 50px 100px,
      #000 55px 80px, #000 70px 60px, #000 80px 45px, #000 110px 95px,
      #000 90px 85px;
  }
  51% {
    box-shadow: #000 30px 70px, #000 40px 80px, rgba(0, 0, 0, 0) 50px 45px,
      #000 55px 80px, #000 70px 60px, #000 80px 45px, #000 110px 95px,
      #000 90px 85px;
  }
  75% {
    box-shadow: #000 30px 95px, #000 40px 100px, #000 50px 60px,
      rgba(0, 0, 0, 0) 55px 95px, #000 70px 80px, #000 80px 70px,
      rgba(0, 0, 0, 0) 110px 120px, rgba(0, 0, 0, 0) 90px 110px;
  }
  76% {
    box-shadow: #000 30px 95px, #000 40px 100px, #000 50px 60px,
      rgba(0, 0, 0, 0) 55px 35px, #000 70px 80px, #000 80px 70px,
      rgba(0, 0, 0, 0) 110px 25px, rgba(0, 0, 0, 0) 90px 15px;
  }
  100% {
    box-shadow: rgba(0, 0, 0, 0) 30px 120px, rgba(0, 0, 0, 0) 40px 120px,
      #000 50px 75px, #000 55px 50px, #000 70px 100px, #000 80px 95px,
      #000 110px 45px, #000 90px 35px;
  }
}
@keyframes rainy_rain {
  0% {
    box-shadow: rgba(0, 0, 0, 0) 30px 30px, rgba(0, 0, 0, 0) 40px 40px,
      #000 50px 75px, #000 55px 50px, #000 70px 100px, #000 80px 95px,
      #000 110px 45px, #000 90px 35px;
  }
  25% {
    box-shadow: #000 30px 45px, #000 40px 60px, #000 50px 90px, #000 55px 65px,
      rgba(0, 0, 0, 0) 70px 120px, rgba(0, 0, 0, 0) 80px 120px, #000 110px 70px,
      #000 90px 60px;
  }
  26% {
    box-shadow: #000 30px 45px, #000 40px 60px, #000 50px 90px, #000 55px 65px,
      rgba(0, 0, 0, 0) 70px 40px, rgba(0, 0, 0, 0) 80px 20px, #000 110px 70px,
      #000 90px 60px;
  }
  50% {
    box-shadow: #000 30px 70px, #000 40px 80px, rgba(0, 0, 0, 0) 50px 100px,
      #000 55px 80px, #000 70px 60px, #000 80px 45px, #000 110px 95px,
      #000 90px 85px;
  }
  51% {
    box-shadow: #000 30px 70px, #000 40px 80px, rgba(0, 0, 0, 0) 50px 45px,
      #000 55px 80px, #000 70px 60px, #000 80px 45px, #000 110px 95px,
      #000 90px 85px;
  }
  75% {
    box-shadow: #000 30px 95px, #000 40px 100px, #000 50px 60px,
      rgba(0, 0, 0, 0) 55px 95px, #000 70px 80px, #000 80px 70px,
      rgba(0, 0, 0, 0) 110px 120px, rgba(0, 0, 0, 0) 90px 110px;
  }
  76% {
    box-shadow: #000 30px 95px, #000 40px 100px, #000 50px 60px,
      rgba(0, 0, 0, 0) 55px 35px, #000 70px 80px, #000 80px 70px,
      rgba(0, 0, 0, 0) 110px 25px, rgba(0, 0, 0, 0) 90px 15px;
  }
  100% {
    box-shadow: rgba(0, 0, 0, 0) 30px 120px, rgba(0, 0, 0, 0) 40px 120px,
      #000 50px 75px, #000 55px 50px, #000 70px 100px, #000 80px 95px,
      #000 110px 45px, #000 90px 35px;
  }
}

/* RAINBOW */
.rainbow {
  -webkit-animation: rainbow 5s ease-in-out infinite;
  animation: rainbow 5s ease-in-out infinite;
  border-radius: 170px 0 0 0;
  box-shadow: #fb323c -2px -2px 0 1px, #f99716 -4px -4px 0 3px,
    #fee124 -6px -6px 0 5px, #afdf2e -8px -8px 0 7px, #6ad7f8 -10px -10px 0 9px,
    #60b1f5 -12px -12px 0 11px, #a3459b -14px -14px 0 13px;
  height: 70px;
  width: 70px;
  margin-left: -40px;
  position: absolute;
  left: 140px;
  top: 60px;
  -webkit-transform: rotate(40deg);
  transform: rotate(40deg);
}
.rainbow:after {
  -webkit-animation: rainbow_shadow 5s ease-in-out infinite;
  animation: rainbow_shadow 5s ease-in-out infinite;
  background: #000000;
  border-radius: 50%;
  content: '';
  opacity: 0.2;
  height: 15px;
  width: 120px;
  position: absolute;
  bottom: -23px;
  left: 17px;
  -webkit-transform: rotate(-40deg);
  transform: rotate(-40deg);
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}
@-webkit-keyframes rainbow {
  50% {
    -webkit-transform: rotate(50deg);
    transform: rotate(50deg);
  }
}
@keyframes rainbow {
  50% {
    -webkit-transform: rotate(50deg);
    transform: rotate(50deg);
  }
}
@-webkit-keyframes rainbow_shadow {
  50% {
    -webkit-transform: rotate(-50deg) translate(10px) scale(0.7);
    transform: rotate(-50deg) translate(10px) scale(0.7);
    opacity: 0.05;
  }
}
@keyframes rainbow_shadow {
  50% {
    -webkit-transform: rotate(-50deg) translate(10px) scale(0.7);
    transform: rotate(-50deg) translate(10px) scale(0.7);
    opacity: 0.05;
  }
}

/* STARRY */
.starry {
  -webkit-animation: starry_star 5s ease-in-out infinite;
  animation: starry_star 5s ease-in-out infinite;
  background: rgb(255, 255, 255);
  border-radius: 50%;
  box-shadow: #ffffff 26px 7px 0 -1px,
    rgba(171, 253, 103, 0.1) -36px -19px 0 -1px,
    rgba(255, 255, 255, 0.1) -51px -34px 0 -1px, #ffffff -52px -62px 0 -1px,
    #ffffff 14px -37px, rgba(255, 255, 255, 0.1) 41px -19px, #ffffff 34px -50px,
    rgba(255, 255, 255, 0.1) 14px -71px 0 -1px, #ffffff 64px -21px 0 -1px,
    rgba(255, 255, 255, 0.1) 32px -85px 0 -1px, #ffffff 64px -90px,
    rgba(255, 255, 255, 0.1) 60px -67px 0 -1px, #ffffff 34px -127px,
    rgba(255, 255, 255, 0.1) -26px -103px 0 -1px;
  height: 4px;
  width: 4px;
  margin-left: -10px;
  opacity: 1;
  position: absolute;
  left: 140px;
  top: 130px;
}
.starry:after {
  -webkit-animation: starry 5s ease-in-out infinite;
  animation: starry 5s ease-in-out infinite;
  border-radius: 50%;
  box-shadow: #ffffff -25px 0;
  content: '';
  height: 100px;
  width: 100px;
  position: absolute;
  top: -106px;
  -webkit-transform: rotate(-5deg);
  transform: rotate(-5deg);
  -webkit-transform-origin: 0 50%;
  transform-origin: 0 50%;
}

@-webkit-keyframes starry {
  50% {
    -webkit-transform: rotate(10deg);
    transform: rotate(10deg);
  }
}

@keyframes starry {
  50% {
    -webkit-transform: rotate(10deg);
    transform: rotate(10deg);
  }
}
@-webkit-keyframes starry_star {
  50% {
    box-shadow: rgba(255, 255, 255, 0.1) 26px 7px 0 -1px,
      #ffffff -36px -19px 0 -1px, #ffffff -51px -34px 0 -1px,
      rgba(255, 255, 255, 0.1) -52px -62px 0 -1px,
      rgba(255, 255, 255, 0.1) 14px -37px, #ffffff 41px -19px,
      rgba(255, 255, 255, 0.1) 34px -50px, #ffffff 14px -71px 0 -1px,
      rgba(255, 255, 255, 0.1) 64px -21px 0 -1px, #ffffff 32px -85px 0 -1px,
      rgba(255, 255, 255, 0.1) 64px -90px, #ffffff 60px -67px 0 -1px,
      rgba(255, 255, 255, 0.1) 34px -127px, #ffffff -26px -103px 0 -1px;
  }
}
@keyframes starry_star {
  50% {
    box-shadow: rgba(255, 255, 255, 0.1) 26px 7px 0 -1px,
      #ffffff -36px -19px 0 -1px, #ffffff -51px -34px 0 -1px,
      rgba(255, 255, 255, 0.1) -52px -62px 0 -1px,
      rgba(255, 255, 255, 0.1) 14px -37px, #ffffff 41px -19px,
      rgba(255, 255, 255, 0.1) 34px -50px, #ffffff 14px -71px 0 -1px,
      rgba(255, 255, 255, 0.1) 64px -21px 0 -1px, #ffffff 32px -85px 0 -1px,
      rgba(255, 255, 255, 0.1) 64px -90px, #ffffff 60px -67px 0 -1px,
      rgba(255, 255, 255, 0.1) 34px -127px, #ffffff -26px -103px 0 -1px;
  }
}

/* STORMY */
.stormy {
  -webkit-animation: stormy 5s ease-in-out infinite;
  animation: stormy 5s ease-in-out infinite;
  background: #222222;
  border-radius: 50%;
  box-shadow: #222222 65px -15px 0 -5px, #222222 25px -25px, #222222 30px 10px,
    #222222 60px 15px 0 -10px, #222222 85px 5px 0 -5px;
  height: 50px;
  width: 50px;
  margin-left: -60px;
  position: absolute;
  left: 140px;
  top: 60px;
}
.stormy:after {
  -webkit-animation: stormy_shadow 5s ease-in-out infinite;
  animation: stormy_shadow 5s ease-in-out infinite;
  background: #000;
  border-radius: 50%;
  content: '';
  height: 15px;
  width: 120px;
  opacity: 0.2;
  position: absolute;
  left: 5px;
  bottom: -60px;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
}
.stormy:before {
  -webkit-animation: stormy_thunder 2s steps(1, end) infinite;
  animation: stormy_thunder 2s steps(1, end) infinite;
  border-left: 0px solid transparent;
  border-right: 7px solid transparent;
  border-top: 43px solid yellow;
  box-shadow: yellow -7px -32px;
  content: '';
  display: block;
  height: 0;
  width: 0;
  position: absolute;
  left: 57px;
  top: 70px;
  -webkit-transform: rotate(14deg);
  transform: rotate(14deg);
  -webkit-transform-origin: 50% -60px;
  transform-origin: 50% -60px;
}
@-webkit-keyframes stormy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@keyframes stormy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@-webkit-keyframes stormy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@keyframes stormy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@-webkit-keyframes stormy_thunder {
  0% {
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
    opacity: 1;
  }
  5% {
    -webkit-transform: rotate(-34deg);
    transform: rotate(-34deg);
    opacity: 1;
  }
  10% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    opacity: 1;
  }
  15% {
    -webkit-transform: rotate(-34deg);
    transform: rotate(-34deg);
    opacity: 0;
  }
}
@keyframes stormy_thunder {
  0% {
    -webkit-transform: rotate(20deg);
    transform: rotate(20deg);
    opacity: 1;
  }
  5% {
    -webkit-transform: rotate(-34deg);
    transform: rotate(-34deg);
    opacity: 1;
  }
  10% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    opacity: 1;
  }
  15% {
    -webkit-transform: rotate(-34deg);
    transform: rotate(-34deg);
    opacity: 0;
  }
}

/* SNOWY */
.snowy {
  -webkit-animation: snowy 5s ease-in-out infinite 1s;
  animation: snowy 5s ease-in-out infinite 1s;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: #ffffff 65px -15px 0 -5px, #ffffff 25px -25px, #ffffff 30px 10px,
    #ffffff 60px 15px 0 -10px, #ffffff 85px 5px 0 -5px;
  display: block;
  height: 50px;
  width: 50px;
  margin-left: -60px;
  position: absolute;
  left: 140px;
  top: 50px;
}
.snowy:after {
  -webkit-animation: snowy_shadow 5s ease-in-out infinite 1s;
  animation: snowy_shadow 5s ease-in-out infinite 1s;
  background: #000000;
  border-radius: 50%;
  content: '';
  height: 15px;
  width: 120px;
  opacity: 0.2;
  position: absolute;
  left: 8px;
  bottom: -60px;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
}
.snowy:before {
  -webkit-animation: snowy_snow 2s infinite linear;
  animation: snowy_snow 2s infinite linear;
  content: '';
  border-radius: 50%;
  display: block;
  height: 7px;
  width: 7px;
  opacity: 0.8;
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
@-webkit-keyframes snowy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@keyframes snowy {
  50% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
}
@-webkit-keyframes snowy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@keyframes snowy_shadow {
  50% {
    -webkit-transform: translateY(20px) scale(1);
    transform: translateY(20px) scale(1);
    opacity: 0.05;
  }
}
@-webkit-keyframes snowy_snow {
  0% {
    box-shadow: rgba(238, 238, 238, 0) 30px 30px,
      rgba(238, 238, 238, 0) 40px 40px, #eeeeee 50px 75px, #eeeeee 55px 50px,
      #eeeeee 70px 100px, #eeeeee 80px 95px, #eeeeee 110px 45px,
      #eeeeee 90px 35px;
  }
  25% {
    box-shadow: #eeeeee 30px 45px, #eeeeee 40px 60px, #eeeeee 50px 90px,
      #eeeeee 55px 65px, rgba(238, 238, 238, 0) 70px 120px,
      rgba(238, 238, 238, 0) 80px 120px, #eeeeee 110px 70px, #eeeeee 90px 60px;
  }
  26% {
    box-shadow: #eeeeee 30px 45px, #eeeeee 40px 60px, #eeeeee 50px 90px,
      #eeeeee 55px 65px, rgba(238, 238, 238, 0) 70px 40px,
      rgba(238, 238, 238, 0) 80px 20px, #eeeeee 110px 70px, #eeeeee 90px 60px;
  }
  50% {
    box-shadow: #eeeeee 30px 70px, #eeeeee 40px 80px,
      rgba(238, 238, 238, 0) 50px 100px, #eeeeee 55px 80px, #eeeeee 70px 60px,
      #eeeeee 80px 45px, #eeeeee 110px 95px, #eeeeee 90px 85px;
  }
  51% {
    box-shadow: #eeeeee 30px 70px, #eeeeee 40px 80px,
      rgba(238, 238, 238, 0) 50px 45px, #eeeeee 55px 80px, #eeeeee 70px 60px,
      #eeeeee 80px 45px, #eeeeee 110px 95px, #eeeeee 90px 85px;
  }
  75% {
    box-shadow: #eeeeee 30px 95px, #eeeeee 40px 100px, #eeeeee 50px 60px,
      rgba(238, 238, 238, 0) 55px 95px, #eeeeee 70px 80px, #eeeeee 80px 70px,
      rgba(238, 238, 238, 0) 110px 120px, rgba(238, 238, 238, 0) 90px 110px;
  }
  76% {
    box-shadow: #eeeeee 30px 95px, #eeeeee 40px 100px, #eeeeee 50px 60px,
      rgba(238, 238, 238, 0) 55px 35px, #eeeeee 70px 80px, #eeeeee 80px 70px,
      rgba(238, 238, 238, 0) 110px 25px, rgba(238, 238, 238, 0) 90px 15px;
  }
  100% {
    box-shadow: rgba(238, 238, 238, 0) 30px 120px,
      rgba(238, 238, 238, 0) 40px 120px, #eeeeee 50px 75px, #eeeeee 55px 50px,
      #eeeeee 70px 100px, #eeeeee 80px 95px, #eeeeee 110px 45px,
      #eeeeee 90px 35px;
  }
}
@keyframes snowy_snow {
  0% {
    box-shadow: rgba(238, 238, 238, 0) 30px 30px,
      rgba(238, 238, 238, 0) 40px 40px, #eeeeee 50px 75px, #eeeeee 55px 50px,
      #eeeeee 70px 100px, #eeeeee 80px 95px, #eeeeee 110px 45px,
      #eeeeee 90px 35px;
  }
  25% {
    box-shadow: #eeeeee 30px 45px, #eeeeee 40px 60px, #eeeeee 50px 90px,
      #eeeeee 55px 65px, rgba(238, 238, 238, 0) 70px 120px,
      rgba(238, 238, 238, 0) 80px 120px, #eeeeee 110px 70px, #eeeeee 90px 60px;
  }
  26% {
    box-shadow: #eeeeee 30px 45px, #eeeeee 40px 60px, #eeeeee 50px 90px,
      #eeeeee 55px 65px, rgba(238, 238, 238, 0) 70px 40px,
      rgba(238, 238, 238, 0) 80px 20px, #eeeeee 110px 70px, #eeeeee 90px 60px;
  }
  50% {
    box-shadow: #eeeeee 30px 70px, #eeeeee 40px 80px,
      rgba(238, 238, 238, 0) 50px 100px, #eeeeee 55px 80px, #eeeeee 70px 60px,
      #eeeeee 80px 45px, #eeeeee 110px 95px, #eeeeee 90px 85px;
  }
  51% {
    box-shadow: #eeeeee 30px 70px, #eeeeee 40px 80px,
      rgba(238, 238, 238, 0) 50px 45px, #eeeeee 55px 80px, #eeeeee 70px 60px,
      #eeeeee 80px 45px, #eeeeee 110px 95px, #eeeeee 90px 85px;
  }
  75% {
    box-shadow: #eeeeee 30px 95px, #eeeeee 40px 100px, #eeeeee 50px 60px,
      rgba(238, 238, 238, 0) 55px 95px, #eeeeee 70px 80px, #eeeeee 80px 70px,
      rgba(238, 238, 238, 0) 110px 120px, rgba(238, 238, 238, 0) 90px 110px;
  }
  76% {
    box-shadow: #eeeeee 30px 95px, #eeeeee 40px 100px, #eeeeee 50px 60px,
      rgba(238, 238, 238, 0) 55px 35px, #eeeeee 70px 80px, #eeeeee 80px 70px,
      rgba(238, 238, 238, 0) 110px 25px, rgba(238, 238, 238, 0) 90px 15px;
  }
  100% {
    box-shadow: rgba(238, 238, 238, 0) 30px 120px,
      rgba(238, 238, 238, 0) 40px 120px, #eeeeee 50px 75px, #eeeeee 55px 50px,
      #eeeeee 70px 100px, #eeeeee 80px 95px, #eeeeee 110px 45px,
      #eeeeee 90px 35px;
  }
}

.container {
  // background: -webkit-linear-gradient(
  //   left,
  //   #00bbff,
  //   #00bbff 14.3%,
  //   #2eb5e5 14.3%,
  //   #2eb5e5 28.6%,
  //   #e6e6e6 28.6%,
  //   #e6e6e6 42.9%,
  //   #f3d166 42.9%,
  //   #f3d166 57.2%,
  //   #222233 57.2%,
  //   #222233 71.5%,
  //   #444444 71.5%,
  //   #444444 85.8%,
  //   #85db8c 85.8%
  // );
  // background: linear-gradient(
  //   left,
  //   #00bbff,
  //   #00bbff 14.3%,
  //   #2eb5e5 14.3%,
  //   #2eb5e5 28.6%,
  //   #e6e6e6 28.6%,
  //   #e6e6e6 42.9%,
  //   #f3d166 42.9%,
  //   #f3d166 57.2%,
  //   #222233 57.2%,
  //   #222233 71.5%,
  //   #444444 71.5%,
  //   #444444 85.8%,
  //   #85db8c 85.8%
  // );
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
