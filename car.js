class car {
  accelerate(speed, direction) {
    console.log(`accelerating at ${speed} in the ${direction} direction`);
  }

  turn(direction) {
    console.log(`turning ${direction}`);
  }

  lights(state) {
    console.log(`the lights are ${state}`);
  }

  blinkers(direction) {
    console.log(`the ${direction} blinker is on`);
  }

  action(options) {
    Object.keys(options).forEach((e) => {
      this[e](...options[e]);
    });
  }
}

const myCar = new car();

myCar.action({
  accelerate: [100, 'forward'],
  lights: ['on'],
  blinkers:['right']
});

//  options.forEach((e) => {
//   const funcName = e[0];
//   const args = e.slice(1);

//   if (typeof this[funcName] === "function") {
//     this[funcName](...args);
//   }
// });
