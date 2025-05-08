document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js with vibrant colors
    particlesJS('particles-js', {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: ["#FF5F6D", "#FFC371", "#4BC0C8", "#C779D0", "#FEAC5E"] },
            shape: { type: "circle" },
            opacity: { value: 0.7, random: true },
            size: { value: 4, random: true },
            line_linked: { 
                enable: true, 
                distance: 120, 
                color: "#ffffff", 
                opacity: 0.4, 
                width: 1 
            },
            move: { 
                enable: true, 
                speed: 3, 
                direction: "none", 
                random: true, 
                straight: false, 
                out_mode: "bounce" 
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Theme Toggle with 3D gradient colors
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;
    let darkMode = true;

    themeBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        if (darkMode) {
            body.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Cosmic Mode';
            document.documentElement.style.setProperty('--primary-color', '#6a11cb');
            document.documentElement.style.setProperty('--secondary-color', '#2575fc');
        } else {
            body.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Neon Mode';
            document.documentElement.style.setProperty('--primary-color', '#FF5F6D');
            document.documentElement.style.setProperty('--secondary-color', '#FFC371');
        }
    });

    // Welcome Dashboard - Always show on load
    const welcomeDashboard = document.getElementById('welcomeDashboard');
    const mainApp = document.getElementById('mainApp');
    const userNameInput = document.getElementById('userName');
    const enterBtn = document.getElementById('enterBtn');
    const userGreeting = document.getElementById('userGreeting');
    const startSound = document.getElementById('startSound');

    // Always show welcome screen (remove localStorage check)
    welcomeDashboard.style.display = 'flex';
    mainApp.style.display = 'none';

    // Add confetti effect to welcome button
    enterBtn.addEventListener('mouseenter', function() {
        this.classList.add('animate__rubberBand');
        setTimeout(() => {
            this.classList.remove('animate__rubberBand');
        }, 1000);
    });

    enterBtn.addEventListener('click', function() {
        const name = userNameInput.value.trim();
        if (name) {
            startSound.play();
            welcomeDashboard.style.opacity = '0';
            setTimeout(() => {
                welcomeDashboard.style.display = 'none';
                mainApp.style.display = 'block';
                userGreeting.textContent = `Welcome, ${name}! Ready to race against time?`;
                
                // Add welcome animation
                userGreeting.classList.add('animate__animated', 'animate__tada');
                setTimeout(() => {
                    userGreeting.classList.remove('animate__animated', 'animate__tada');
                }, 1000);
            }, 500);
        } else {
            userNameInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                userNameInput.style.animation = '';
            }, 500);
        }
    });

    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enterBtn.click();
        }
    });

    // Clock Functionality with 3D effect
    const clock = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const tickSound = document.getElementById('tickSound');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Create 3D text effect
        clock.innerHTML = `
            <span class="clock-text">${hours}:${minutes}:${seconds}</span>
            <span class="clock-shadow"></span>
        `;
        
        // Update date with fancy formatting
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerHTML = `
            <span class="date-text">${now.toLocaleDateString(undefined, options)}</span>
            <span class="date-shadow"></span>
        `;
        
        // Play quiet ticking sound for clock
        tickSound.volume = 0.1;
        tickSound.currentTime = 0;
        tickSound.play();
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // Stopwatch Functionality with enhanced features
    const stopwatch = document.getElementById('stopwatch');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapsContainer = document.getElementById('laps');
    const lapBadge = document.getElementById('lapBadge');
    const lapCount = document.getElementById('lapCount');
    const fastestLap = document.getElementById('fastestLap');
    const slowestLap = document.getElementById('slowestLap');
    const runner = document.getElementById('runner');
    const sparks = document.getElementById('sparks');
    const lapSound = document.getElementById('lapSound');
    const cheerSound = document.getElementById('cheerSound');
    
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let laps = [];
    let isRunning = false;
    let lapHistory = [];
    
    // NEW: Add speed boost feature
    let speedBoostActive = false;
    let speedBoostCount = 0;
    const speedBoostBtn = document.createElement('button');
    speedBoostBtn.innerHTML = '<i class="fas fa-bolt"></i> Speed Boost (3)';
    speedBoostBtn.className = 'btn-speed';
    document.querySelector('.controls').appendChild(speedBoostBtn);
    
    // NEW: Format time with 3D effect
    function formatTime(time) {
        const date = new Date(time);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0').substring(0, 2);
        return `
            <span class="time-text">${hours}:${minutes}:${seconds}.${milliseconds}</span>
            <span class="time-shadow"></span>
        `;
    }
    
    // Update the stopwatch display with 3D effect
    function updateStopwatch() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        stopwatch.innerHTML = formatTime(elapsedTime);
        
        // Move the runner along the track with speed boost effect
        let progress = Math.min(elapsedTime / 60000, 1); // 1 minute max for demo
        if (speedBoostActive) {
            progress = Math.min(progress * 1.5, 1); // 50% speed boost
        }
        runner.style.left = `${progress * 100}%`;
        
        // Create dynamic sparks when moving
        if (progress > 0.3 && progress < 0.9 && Math.random() > 0.7) {
            createSpark();
        }
        
        // NEW: Add trail effect
        if (isRunning && Math.random() > 0.9) {
            createTrail();
        }
    }
    
    // NEW: Create runner trail effect
    function createTrail() {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = runner.style.left;
        document.querySelector('.track').appendChild(trail);
        
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0)';
            setTimeout(() => {
                trail.remove();
            }, 1000);
        }, 50);
    }
    
    // Create spark animation with random colors
    function createSpark() {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.animationDuration = `${0.3 + Math.random() * 0.4}s`;
        spark.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        sparks.appendChild(spark);
        
        setTimeout(() => {
            spark.remove();
        }, 1000);
    }
    
    // Start the stopwatch with animation
    function startStopwatch() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateStopwatch, 10);
            isRunning = true;
            startSound.play();
            
            // Add flame animation
            runner.querySelector('.flame').style.animation = 'flicker 0.5s infinite alternate';
            runner.querySelector('.flame-inner').style.animation = 'flicker 0.3s infinite alternate';
            
            // NEW: Add pulse effect to start button
            startBtn.classList.add('active-pulse');
        }
    }
    
    // Stop the stopwatch
    function stopStopwatch() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            speedBoostActive = false; // Reset speed boost
            
            // Stop flame animation
            runner.querySelector('.flame').style.animation = 'none';
            runner.querySelector('.flame-inner').style.animation = 'none';
            
            // NEW: Remove pulse effect
            startBtn.classList.remove('active-pulse');
        }
    }
    
    // Reset the stopwatch with animation
    function resetStopwatch() {
        stopStopwatch();
        elapsedTime = 0;
        stopwatch.innerHTML = formatTime(0);
        laps = [];
        lapsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-flag"></i>
                <p>Your lap times will appear here</p>
            </div>
        `;
        lapBadge.textContent = '0';
        lapCount.textContent = '0';
        fastestLap.innerHTML = formatTime(0);
        slowestLap.innerHTML = formatTime(0);
        runner.style.left = '0';
        speedBoostCount = 3;
        speedBoostBtn.innerHTML = `<i class="fas fa-bolt"></i> Speed Boost (${speedBoostCount})`;
        
        // Reset achievements with animation
        document.querySelectorAll('.achievement').forEach((ach, index) => {
            ach.className = 'achievement locked';
            ach.innerHTML = `<i class="fas fa-lock"></i><span>${ach.textContent.trim()}</span>`;
        });
        
        // NEW: Add reset animation
        stopwatch.classList.add('animate__animated', 'animate__flipInX');
        setTimeout(() => {
            stopwatch.classList.remove('animate__animated', 'animate__flipInX');
        }, 1000);
    }
    
    // NEW: Speed boost functionality
    speedBoostBtn.addEventListener('click', function() {
        if (isRunning && speedBoostCount > 0) {
            speedBoostActive = true;
            speedBoostCount--;
            this.innerHTML = `<i class="fas fa-bolt"></i> Speed Boost (${speedBoostCount})`;
            
            // Add boost effect
            runner.classList.add('speed-boost');
            setTimeout(() => {
                speedBoostActive = false;
                runner.classList.remove('speed-boost');
            }, 3000);
            
            // Play boost sound
            const boostSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fast-rocket-whoosh-1714.mp3');
            boostSound.play();
        }
    });
    
    // Record a lap time with enhanced features
    function recordLap() {
        if (isRunning) {
            lapSound.play();
            const lapTime = elapsedTime;
            const lapObj = {
                time: lapTime,
                formatted: formatTime(lapTime),
                timestamp: new Date().toLocaleTimeString()
            };
            
            laps.push(lapObj);
            lapHistory.push(lapObj);
            
            // Update lap count with animation
            lapBadge.textContent = laps.length;
            lapCount.textContent = laps.length;
            lapBadge.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                lapBadge.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
            
            // Update fastest and slowest laps
            if (laps.length === 1) {
                fastestLap.innerHTML = lapObj.formatted;
                slowestLap.innerHTML = lapObj.formatted;
                unlockAchievement(0, 'First Lap', 'fas fa-flag-checkered');
            } else {
                const fastest = laps.reduce((min, lap) => lap.time < min.time ? lap : min, laps[0]);
                const slowest = laps.reduce((max, lap) => lap.time > max.time ? lap : max, laps[0]);
                fastestLap.innerHTML = fastest.formatted;
                slowestLap.innerHTML = slowest.formatted;
                
                // NEW: Check for personal best
                if (lapTime === fastest.time) {
                    cheerSound.play();
                    const pbBadge = document.createElement('div');
                    pbBadge.className = 'pb-badge animate__animated animate__rubberBand';
                    pbBadge.innerHTML = '<i class="fas fa-crown"></i> PB!';
                    lapsContainer.appendChild(pbBadge);
                    setTimeout(() => {
                        pbBadge.remove();
                    }, 2000);
                }
            }
            
            // Check for achievements
            if (laps.length === 5) unlockAchievement(1, '5 Laps', 'fas fa-medal');
            if (laps.length === 10) unlockAchievement(3, '10 Laps', 'fas fa-double-medal');
            if (laps.length > 0 && laps[laps.length - 1].time < 5000) {
                unlockAchievement(2, 'Speedster', 'fas fa-bolt');
            }
            
            // NEW: Check for consistent laps achievement
            if (laps.length >= 3) {
                const lastThree = laps.slice(-3).map(lap => lap.time);
                const variation = Math.max(...lastThree) - Math.min(...lastThree);
                if (variation < 1000) {
                    unlockAchievement(4, 'Consistency', 'fas fa-balance-scale');
                }
            }
            
            // Update laps list with enhanced display
            updateLapsList();
        }
    }
    
    // Update the laps list with more information
    function updateLapsList() {
        if (laps.length > 0) {
            lapsContainer.innerHTML = '';
            laps.forEach((lap, index) => {
                const lapElement = document.createElement('div');
                lapElement.className = 'lap-item';
                
                // Highlight fastest and slowest laps
                const isFastest = lap.time === Math.min(...laps.map(l => l.time));
                const isSlowest = lap.time === Math.max(...laps.map(l => l.time));
                
                if (isFastest) lapElement.classList.add('fastest');
                if (isSlowest) lapElement.classList.add('slowest');
                
                // Calculate difference from previous lap
                let diff = '';
                if (index > 0) {
                    const difference = lap.time - laps[index - 1].time;
                    const absDiff = Math.abs(difference);
                    const diffTime = formatTime(absDiff);
                    if (difference > 0) {
                        diff = `<span class="lap-diff slower">+${diffTime}</span>`;
                    } else if (difference < 0) {
                        diff = `<span class="lap-diff faster">-${diffTime}</span>`;
                    } else {
                        diff = `<span class="lap-diff same">±${diffTime}</span>`;
                    }
                }
                
                lapElement.innerHTML = `
                    <div class="lap-header">
                        <span class="lap-number">Lap ${index + 1}</span>
                        <span class="lap-timestamp">${lap.timestamp}</span>
                    </div>
                    <div class="lap-body">
                        <span class="lap-time">${lap.formatted}</span>
                        ${diff}
                    </div>
                    <div class="lap-footer">
                        ${isFastest ? '<i class="fas fa-crown fastest-icon"></i>' : ''}
                        ${isSlowest ? '<i class="fas fa-turtle slowest-icon"></i>' : ''}
                    </div>
                `;
                
                lapsContainer.appendChild(lapElement);
            });
        }
    }
    
    // Enhanced unlock achievement with confetti
    function unlockAchievement(index, title, icon) {
        const achievements = document.querySelectorAll('.achievement');
        if (index < achievements.length) {
            const achievement = achievements[index];
            if (achievement.classList.contains('locked')) {
                achievement.className = 'achievement unlocked animate__animated animate__tada';
                achievement.innerHTML = `<i class="${icon}"></i><span>${title}</span>`;
                cheerSound.play();
                
                // Enhanced celebration effect
                const confettiCount = 30;
                for (let i = 0; i < confettiCount; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti-particle';
                    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                    confetti.style.left = `${Math.random() * 100}%`;
                    confetti.style.animationDuration = `${1 + Math.random() * 2}s`;
                    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
                    achievement.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 3000);
                }
                
                // NEW: Show achievement toast
                showToast(`Achievement Unlocked: ${title}`);
            }
        }
    }
    
    // NEW: Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast animate__animated animate__fadeInUp';
        toast.innerHTML = `
            <i class="fas fa-trophy"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('animate__fadeOut');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }
    
    // NEW: Add fireworks effect for special milestones
    function launchFireworks() {
        const colors = ['#FF5F6D', '#FFC371', '#4BC0C8', '#C779D0', '#FEAC5E'];
        const container = document.querySelector('.stopwatch-container');
        
        for (let i = 0; i < 20; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework-particle';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.left = `${10 + Math.random() * 80}%`;
            firework.style.top = `${10 + Math.random() * 80}%`;
            container.appendChild(firework);
            
            setTimeout(() => {
                firework.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px)`;
                firework.style.opacity = '0';
                
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, 50);
        }
    }
    
    // Event listeners with animations
    startBtn.addEventListener('click', startStopwatch);
    stopBtn.addEventListener('click', stopStopwatch);
    lapBtn.addEventListener('click', recordLap);
    resetBtn.addEventListener('click', resetStopwatch);
    
    // NEW: Add button hover effects
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });
    
    // Initialize
    resetStopwatch();
    
    // NEW: Easter egg - secret code
    let konamiCode = [];
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-secretCode.length);
        
        if (konamiCode.join('') === secretCode.join('')) {
            launchFireworks();
            showToast('Secret Mode Activated!');
            document.body.classList.add('secret-mode');
            setTimeout(() => {
                document.body.classList.remove('secret-mode');
            }, 5000);
            konamiCode = [];
        }
    });
});
