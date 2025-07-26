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


// Dev B: Project Filter System
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const visibleCount = document.getElementById('visible-count');

// ฟังก์ชันสำหรับอัปเดตจำนวนโปรเจกต์ที่แสดง
function updateVisibleCount() {
    let count = 0;
    projectCards.forEach(card => {
        if (!card.classList.contains('hide')) {
            count++;
        }
    });
    if (visibleCount) {
        visibleCount.textContent = count;
    }
}

filterButtons.forEach(button => {
    button.addEventListener('click', function (event) { // เพิ่ม event parameter
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        // Filter projects พร้อมแอนิเมชัน
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }

                // อัปเดตจำนวนที่มองเห็นหลังจากที่ filter/animation เสร็จสิ้นสำหรับ card สุดท้าย
                if (index === projectCards.length - 1) {
                    setTimeout(updateVisibleCount, 300); // หน่วงเวลาเล็กน้อยเพื่อให้แอนิเมชันเสร็จ
                }
            }, index * 50); // หน่วงเวลา 50ms สำหรับแต่ละ card
        });

        // เพิ่ม Ripple Effect ให้กับปุ่มที่ถูกคลิก
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        // คำนวณตำแหน่งของ ripple ให้เริ่มจากจุดที่คลิก
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);

        // ลบ ripple ออกหลังจากแอนิเมชันเสร็จสิ้น
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// เรียกใช้ filter 'all' ครั้งแรกเมื่อหน้าโหลด เพื่อให้แสดงโปรเจกต์ทั้งหมดและอัปเดต count
document.addEventListener('DOMContentLoaded', () => {
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
        allButton.click(); // จำลองการคลิกปุ่ม 'All'
    } else {
        updateVisibleCount(); // ถ้าไม่มีปุ่ม 'All' ให้เรียก updateVisibleCount โดยตรง
    }
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

// Dev B: Back to Top Button
const backToTopButton = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

backToTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Add click animation
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);
});

// Throttle scroll event for performance
let ticking = false;
function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(toggleBackToTop);
        ticking = true;
    }
}

window.addEventListener('scroll', () => {
    requestTick();
    ticking = false;
});
document.addEventListener('DOMContentLoaded', toggleBackToTop);


