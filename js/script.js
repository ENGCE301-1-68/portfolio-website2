// Dev A: Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // ตั้งค่า theme เริ่มต้น
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Event listener สำหรับการคลิก
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // เปลี่ยน theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // เพิ่ม animation effect: หมุนไอคอน
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300); // กลับสู่ตำแหน่งเดิมหลังจาก 0.3 วินาที
    });
    
    function updateThemeIcon(theme) {
        themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
});

// Dev A: Loading Animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    const progressBar = document.querySelector('.progress-fill');
    
    // ตั้งค่า body overflow เป็น hidden เพื่อป้องกัน scroll ระหว่างโหลด
    document.body.style.overflow = 'hidden';

    // จำลองการโหลด content ด้วยการเพิ่ม progress ทีละ 10%
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 10;
        if (progressBar) { // ตรวจสอบว่า progressBar มีอยู่จริง
            progressBar.style.width = progress + '%'; // อัปเดตความกว้างของ progress bar
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval); // หยุด interval เมื่อโหลดครบ 100%
            
            // Fade out loader
            setTimeout(() => {
                if (loader) { // ตรวจสอบว่า loader มีอยู่จริง
                    loader.classList.add('fade-out');
                    
                    // ลบ loader ออกจาก DOM และคืนค่า overflow ของ body
                    setTimeout(() => {
                        loader.style.display = 'none';
                        document.body.style.overflow = 'auto'; // คืนค่า overflow ของ body
                    }, 500); // รอให้ fade-out animation เสร็จสิ้น
                }
            }, 500); // หน่วงเวลาเล็กน้อยก่อน fade-out
        }
    }, 150); // เพิ่ม progress ทุกๆ 150 มิลลิวินาที
});


// Dev A: Scroll Progress Indicator และ Navbar Highlight
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
    
    // Highlight current section in navbar
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - (window.innerHeight / 3); // ปรับ offset เพื่อให้ active เมื่อ scroll ไปถึงประมาณ 1/3 ของหน้าจอ
        const sectionBottom = sectionTop + section.offsetHeight;
        const currentId = section.getAttribute('id');

        if (scrollTop >= sectionTop && scrollTop <= sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Event listeners สำหรับ Scroll Progress
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
document.addEventListener('DOMContentLoaded', updateScrollProgress);


// Project Filter System B
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});

// Typing Animation
const typingText = document.getElementById('typing-text');
const textArray = ['Full Stack Developer', 'React Specialist', 'Node.js Expert', 'UI/UX Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = textArray[textIndex];
    
    if (!isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
            return;
        }
    } else {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
        }
    }
    
    setTimeout(typeWriter, isDeleting ? 50 : 150);
}

// Start typing animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000);
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});