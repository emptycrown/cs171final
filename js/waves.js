// Code borrowed from here: https://stackoverflow.com/questions/17202548/wavy-shape-with-css


class Waves {
  constructor(canvas, options) {
    const defaults = {
      height: 120,
      width: 1440,
      waveHeightMultiplier: 0.9,
      count: 3,
      speed: 0.8,
    }
    this.options = Object.assign({}, defaults, options);
    
    this.canvas = canvas;
    this.container = this.canvas.parentNode;
    
    this.waves = [];
    
    this._initialize();
  }
  
  _initialize() {
    this.app = new PIXI.Application( this.options.width, this.options.height*3, {
      antialias: true,
      transparent: true,
      view: this.canvas,
      resolution: 1
    });
    this.stage = new PIXI.Container();

    this.app.render(this.stage);
    
    for (var i = 0; i < this.options.count; i++) {
      this._makeWaveBlock();
    }
    
    this._animate();
  }
  
  _makeWaveBlock() {
    let key = this.waves.length;
    let width = this.options.width * 2;
    let section = width / 8;
    let blockHeight = this.options.height;
    let waveHeight = this.options.height * this.options.waveHeightMultiplier;
    let inverser = Math.round(key % 2 * 2 - 1);
    
    let travel =  this.app.renderer.width - width;
    this.waves[key] = {
      pos : {
        x: -travel / (key + 1),
        y: blockHeight + Math.round(blockHeight * 0.665 * Math.random() * inverser)
      },
      direction: inverser,
      speed: this.options.speed * 3 * Math.random(),
      object: new PIXI.Graphics()
    };
  
    let wave = this.waves[key];
    let obj = wave.object;
    
    this.app.stage.addChild(obj);

    obj.x = -wave.pos.x;
    obj.y = wave.pos.y;
    obj.lineStyle(0);
    obj.beginFill(0x18FFFF, 0.4);
    obj.blendMode = PIXI.BLEND_MODES.OVERLAY;

    obj.moveTo(0,0); //TL
    
    //Top Line
    obj.quadraticCurveTo(
      section,   (waveHeight * inverser),
      section*2, 0);
    
    obj.quadraticCurveTo(
      section*3, (-waveHeight * inverser),
      section*4, 0);
    
    obj.quadraticCurveTo(
      section*5, (waveHeight * inverser),
      section*6, 0);
    
    obj.quadraticCurveTo(
      section*7, (-waveHeight * inverser),
      section*8, 0);
    
    //Right Side
    obj.lineTo(width, this.options.height); //BR

    //Bottom Line
    obj.quadraticCurveTo(
      section*7, (-waveHeight * inverser) + blockHeight,
      section*6, blockHeight);
    
    obj.quadraticCurveTo(
      section*5, (waveHeight * inverser) + blockHeight,
      section*4, blockHeight);
    
    obj.quadraticCurveTo(
      section*3, (-waveHeight * inverser) + blockHeight,
      section*2, blockHeight);
    
    obj.quadraticCurveTo(
      section*1, (waveHeight * inverser) + blockHeight,
      0,         blockHeight);
    
    //Left Side
    obj.lineTo(0,this.options.height); //BL
  }
  
  _animate() {
    const self = this;
    this.app.ticker.add(function() {
      let width = self.app.renderer.width;
      let travel =  width - (width * 2);
      self.waves.forEach((wave, index) => {
        let obj = wave.object;
        if (obj.x >= 0) {
          wave.direction = -1;
        }
        if (obj.x <= travel) {
          wave.direction = 1;
        }
        obj.x = obj.x + (wave.speed) * wave.direction;
      });
    });
  }
}

let canvas = document.getElementById('canvasHolder');

var waves = new Waves(canvas);