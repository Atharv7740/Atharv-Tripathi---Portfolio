// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star);
  return star;
}

const stars = Array(200).fill().map(addStar);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Add point lights
const pointLight1 = new THREE.PointLight(0x64ffda, 1);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff6464, 1);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Create floating polyhedron
const dodecahedronGeometry = new THREE.DodecahedronGeometry(10, 0);
const dodecahedronMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x64ffda,
  wireframe: true
});
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
dodecahedron.position.z = -30;
dodecahedron.position.x = 15;
scene.add(dodecahedron);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate stars slightly
  stars.forEach(star => {
    star.rotation.x += 0.001;
    star.rotation.y += 0.001;
  });
  
  // Rotate dodecahedron
  dodecahedron.rotation.x += 0.002;
  dodecahedron.rotation.y += 0.002;
  
  // Move camera on scroll
  camera.position.z = 30 - window.scrollY * 0.01;
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll animation with improved visibility detection
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

function checkSections() {
  const triggerBottom = window.innerHeight * 0.8;
  
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    
    if (sectionTop < triggerBottom) {
      section.classList.add('visible');
    }
  });
  
  // Find which section is currently most visible
  let current = '';
  let maxVisibility = 0;
  
  sections.forEach(section => {
    const box = section.getBoundingClientRect();
    const visibleHeight = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
    
    if (visibleHeight > maxVisibility && visibleHeight > window.innerHeight * 0.3) {
      maxVisibility = visibleHeight;
      current = section.getAttribute('id');
    }
  });
  
  // Update navigation highlighting
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
}

// Initial check and scroll listener
window.addEventListener('scroll', checkSections);
window.addEventListener('resize', checkSections);
window.addEventListener('load', checkSections);

// Mobile navigation
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

mobileNavToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('active');
  mobileNavToggle.textContent = navLinksContainer.classList.contains('active') ? '×' : '☰';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('active');
    mobileNavToggle.textContent = '☰';
  });
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  cursorFollower.style.left = e.clientX + 'px';
  cursorFollower.style.top = e.clientY + 'px';
  
  cursor.classList.add('active');
  cursorFollower.classList.add('active');
});

document.addEventListener('mouseout', () => {
  cursor.classList.remove('active');
  cursorFollower.classList.remove('active');
});

document.addEventListener('mousedown', () => {
  cursor.classList.add('expand');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('expand');
});

// Enhanced hover effects
const interactiveElements = document.querySelectorAll('a, button, .skill-card, .card, .education-card, .profile-pic');
interactiveElements.forEach(element => {
  element.addEventListener('mouseover', () => {
    cursor.classList.add('expand');
  });
  
  element.addEventListener('mouseleave', () => {
    cursor.classList.remove('expand');
  });
});

// Loading screen
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');

let progress = 0;
const interval = setInterval(() => {
  progress += 1;
  loadingBar.style.width = progress + '%';
  
  if (progress >= 100) {
    clearInterval(interval);
    setTimeout(() => {
      loadingScreen.style.opacity = 0;
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        animate();
      }, 500);
    }, 500);
  }
}, 30);

// WhatsApp direct linking
document.addEventListener('DOMContentLoaded', () => {
  // Get the WhatsApp link
  const whatsappLink = document.querySelector('.whatsapp-direct');
  
  if (whatsappLink) {
    // Remove any existing event listeners by cloning and replacing
    const newWhatsappLink = whatsappLink.cloneNode(true);
    whatsappLink.parentNode.replaceChild(newWhatsappLink, whatsappLink);
    
    // Add direct click handler that forces navigation
    newWhatsappLink.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open('https://api.whatsapp.com/send?phone=917703893440&text=Hi%20Atharv,%20I%20visited%20your%20portfolio', '_blank');
    });
  }
});

// Add subtle animation to profile pic
const profilePic = document.querySelector('.profile-pic');
if (profilePic) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const aboutSection = document.getElementById('about');
    const aboutTop = aboutSection.offsetTop;
    const aboutHeight = aboutSection.offsetHeight;
    
    if (scrollPosition > aboutTop - window.innerHeight && 
        scrollPosition < aboutTop + aboutHeight) {
      const scrollPercentage = (scrollPosition - (aboutTop - window.innerHeight)) / 
                              (aboutHeight + window.innerHeight);
      const rotateValue = scrollPercentage * 5; // max 5 degrees rotation
      
      profilePic.style.transform = `translateY(-5px) rotateZ(${rotateValue}deg)`;
    }
  });
}

// Resume download tracking (optional)
const downloadButton = document.querySelector('.download-btn');
if (downloadButton) {
  downloadButton.addEventListener('click', () => {
    // You could add analytics tracking here in the future
    console.log('Resume downloaded');
  });
}