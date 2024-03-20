AFRAME.registerComponent('thumbstick-logging',{
    init: function () {
      this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (evt) {
      if (evt.detail.y > 0.95) { console.log("DOWN"); }
      if (evt.detail.y < -0.95) { console.log("UP"); }
      if (evt.detail.x < -0.95) { console.log("LEFT"); }
      if (evt.detail.x > 0.95) { console.log("RIGHT"); }
    }
});
  


AFRAME.registerComponent('handle-events', {
     init: function () {
       var el = this.el;
       console.log(el)  //
       el.addEventListener('mouseenter', function () {
         console.log(el.getAttribute('data-info'));
         console.log("mouseenter");

       });
       el.addEventListener('mouseleave', function () {
           console.log(el.getAttribute('data-info'));
           console.log("mouseleave");
       });
       el.addEventListener('click', function () {
           console.log(el.getAttribute('data-info'));
           console.log("click");
           alert(el.getAttribute('data-info'));
       });
     }
 });

// Mech Zorro
AFRAME.registerComponent('click-listener', {
  init: function () {
    this.el.addEventListener('click', this.onClick.bind(this));
  },
  onClick: function () {
    console.log("Clic en el zorro");
    var animationMixer = this.el.components['animation-mixer'];
    if (animationMixer && animationMixer.mixer) {
      // Detener la animación si ya está en curso
      animationMixer.stopAction();
    } else {
      // Comenzar la animación si no está en curso
      this.el.setAttribute('animation-mixer', { clip: 'Walk', loop: 'repeat' });
    }
  }
});

// Mech Fenix

AFRAME.registerComponent('phoenix-component', {
  init: function () {
    this.el.addEventListener('click', this.onPhoenixClick.bind(this));
    this.flightSpeed = 0.001; // Ajusta la velocidad de vuelo
    this.flying = false; // Inicializamos en false
    this.radius = 25; // Radio del círculo de vuelo
    this.speed = 0.099; // Velocidad de vuelo
    this.angle = 0; // Inicializamos el ángulo

    // Agregar animation-mixer para controlar las animaciones del modelo
    this.mixer = null;

    // Obtener el modelo del Fénix
    this.phoenixModel = this.el.getObject3D('mesh');

    // Verificar si el modelo tiene animaciones
    if (this.phoenixModel) {
      this.mixer = new THREE.AnimationMixer(this.phoenixModel);
      this.phoenixModel.traverse(child => {
        if (child.isMesh) {
          child.material.transparent = true;
        }
      });
      useEffect(() => {
        // Imprime los nombres de las animaciones disponibles
        if (this.mixer) {
          this.phoenixModel.animations.forEach(clip => {
            console.log('Nombre de la animación:', clip.name);
          });
        }
      
        // Intenta reproducir la animación 'idle'
        this.playAnimation('idle'); // Reemplaza 'idle' con el nombre real de tu animación de vuelo
      }, []);
      
    }
  },
  onPhoenixClick: function () {
    console.log("Clic en el Fénix. Estado de vuelo:", this.flying);
    // Cambiar el estado de vuelo al hacer clic
    this.flying = !this.flying;
  },
  tick: function (time, timeDelta) {
    if (this.flying) {
      console.log("Tick del Fénix. Estado de vuelo:", this.flying);
      // Lógica de vuelo circular
      this.angle += this.speed * timeDelta / 1000; // Convertir a segundos
      const x = this.radius * Math.cos(this.angle);
      const z = this.radius * Math.sin(this.angle);
      this.el.setAttribute('position', { x, y: 10, z }); // Ajusta 'y' según la altura deseada
      this.el.object3D.lookAt(new THREE.Vector3(0, 10, 0)); // Ajusta según la altura deseada
    }

    // Actualizar la animación del mixer
    if (this.mixer) {
      this.mixer.update(timeDelta / 1000);
    }
  },
  playAnimation: function (animationName) {
    if (this.mixer) {
      const clip = THREE.AnimationClip.findByName(this.phoenixModel.animations, animationName);
      if (clip) {
        const action = this.mixer.clipAction(clip);
        action.reset().play();
      }
    }
  }
});













