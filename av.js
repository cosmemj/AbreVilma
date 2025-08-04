/*--------------------
Vars
--------------------*/
let progress = 30
let active = 0

// Variables para el control táctil
let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0
let isSwiping = false
let swipeThreshold = 50 // Píxeles mínimos para considerar un swipe

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) =>
  array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index - active) / $items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor((progress / 100) * ($items.length - 1))
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Navigation Functions
--------------------*/
const goToNext = () => {
  const nextIndex = (active + 1) % $items.length
  progress = (nextIndex / $items.length) * 100 + 10
  animate()
}

const goToPrevious = () => {
  const prevIndex = active === 0 ? $items.length - 1 : active - 1
  progress = (prevIndex / $items.length) * 100 + 10
  animate()
}

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', (e) => {
    // Solo navegar si no fue un swipe
    if (!isSwiping) {
      progress = (i / $items.length) * 100 + 10
      animate()
    }
  })
})

/*--------------------
Touch Events for Swipe Functionality
--------------------*/
const carousel = document.querySelector('.carousel')

if (carousel) {
  // Detectar el inicio del toque
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    isSwiping = false
  }, { passive: true })

  // Detectar el movimiento del toque
  carousel.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return

    touchEndX = e.touches[0].clientX
    touchEndY = e.touches[0].clientY

    const deltaX = Math.abs(touchEndX - touchStartX)
    const deltaY = Math.abs(touchEndY - touchStartY)

    // Si el movimiento horizontal es mayor que el vertical, es un swipe
    if (deltaX > deltaY && deltaX > 10) {
      isSwiping = true
      // Prevenir el scroll de la página durante el swipe horizontal
      e.preventDefault()
    }
  }, { passive: false })

  // Detectar el final del toque
  carousel.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return

    const deltaX = touchEndX - touchStartX
    const deltaY = Math.abs(touchEndY - touchStartY)

    // Solo procesar swipe si el movimiento horizontal es significativo
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > deltaY) {
      isSwiping = true
      
      if (deltaX > 0) {
        // Swipe hacia la derecha - ir a la imagen anterior
        goToPrevious()
      } else {
        // Swipe hacia la izquierda - ir a la siguiente imagen
        goToNext()
      }
    }

    // Resetear valores
    touchStartX = 0
    touchStartY = 0
    touchEndX = 0
    touchEndY = 0
    
    // Resetear isSwiping después de un pequeño delay para evitar clicks accidentales
    setTimeout(() => {
      isSwiping = false
    }, 100)
  }, { passive: true })

  // Manejar cuando se cancela el toque
  carousel.addEventListener('touchcancel', () => {
    touchStartX = 0
    touchStartY = 0
    touchEndX = 0
    touchEndY = 0
    isSwiping = false
  }, { passive: true })
}

/*--------------------
Smooth scrolling for navigation
--------------------*/
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/*--------------------
Logo navigation scroll effect
--------------------*/
const navLogo = document.querySelector('.nav-logo');
const header = document.querySelector('header');

if (navLogo && header) {
  let headerHeight = header.offsetHeight;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Mostrar logo cuando se haya scrolleado más allá del header
    if (scrollY > headerHeight) {
      navLogo.classList.add('show');
    } else {
      navLogo.classList.remove('show');
    }
  };

  // Ejecutar al cargar la página
  handleScroll();
  
  // Ejecutar al hacer scroll
  window.addEventListener('scroll', handleScroll);
  
  // Recalcular altura del header si cambia el tamaño de ventana
  window.addEventListener('resize', () => {
    headerHeight = header.offsetHeight;
    handleScroll();
  });
}