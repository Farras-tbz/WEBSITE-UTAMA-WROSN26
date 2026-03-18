// ==========================================
// OSN MATEMATIKA 2026 - FUTURISTIC SCRIPT
// ==========================================

// Data Soal (sama seperti sebelumnya, disingkat untuk contoh)
const questions = {
    easy: {
        pg: [
            {
                q: 'Jika x + <span class="frac"><span class="num">1</span><span class="den">x</span></span> = 3, maka nilai dari x² + <span class="frac"><span class="num">1</span><span class="den">x²</span></span> adalah...',
                options: ["5", "7", "9", "11", "13"],
                correct: 1,
                solution: 'Kita kuadratkan kedua ruas: (x + <span class="frac"><span class="num">1</span><span class="den">x</span></span>)² = 9<br>Maka: x² + 2 + <span class="frac"><span class="num">1</span><span class="den">x²</span></span> = 9<br>Jadi: x² + <span class="frac"><span class="num">1</span><span class="den">x²</span></span> = 7'
            },
            {
                q: "Banyaknya faktor positif dari 72 adalah...",
                options: ["8", "10", "12", "14", "16"],
                correct: 2,
                solution: 'Faktorkan: 72 = 2³ × 3²<br>Banyak faktor = (3+1)(2+1) = 12'
            }
        ],
        isian: [
            {
                q: 'Tentukan nilai dari 1 + 2 + 3 + ... + 20.',
                answer: "210",
                solution: 'S<sub>n</sub> = <span class="frac"><span class="num">n(a<sub>1</sub> + a<sub>n</sub>)</span><span class="den">2</span></span> = <span class="frac"><span class="num">20 × 21</span><span class="den">2</span></span> = 210'
            }
        ]
    },
    medium: {
        pg: [
            {
                q: 'Nilai dari Σ<sub>k=1</sub><sup>100</sup> <span class="frac"><span class="num">1</span><span class="den">k(k+1)</span></span> adalah...',
                options: ['<span class="frac"><span class="num">99</span><span class="den">100</span></span>', '<span class="frac"><span class="num">100</span><span class="den">101</span></span>', "1"],
                correct: 1,
                solution: 'Deret teleskopik: 1 - <span class="frac"><span class="num">1</span><span class="den">101</span></span> = <span class="frac"><span class="num">100</span><span class="den">101</span></span>'
            }
        ],
        isian: [
            {
                q: 'Tentukan nilai dari √(2 + √3) - √(2 - √3).',
                answer: "sqrt(2)",
                solution: 'Kuadratkan: x² = 4 - 2 = 2, jadi x = √2'
            }
        ]
    },
    hard: {
        pg: [
            {
                q: 'Misalkan a, b, c adalah akar-akar dari x³ - 3x + 1 = 0. Nilai a<sup>8</sup> + b<sup>8</sup> + c<sup>8</sup> adalah...',
                options: ["18", "21", "24"],
                correct: 1,
                solution: 'Gunakan relasi rekurensi, S<sub>8</sub> = 21'
            }
        ],
        isian: [
            {
                q: 'Tentukan banyaknya subhimpunan dari {1,2,...,10} tanpa dua bilangan berurutan.',
                answer: "144",
                solution: 'Barisan Fibonacci: a<sub>10</sub> = 144'
            }
        ]
    }
};

// State Variables
let currentLevel = null;
let currentQuestions = [];
let currentIndex = 0;
let answers = [];
let doubts = [];
let score = 0;
let isTryOutCompleted = false;

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    if (pageId === 'home') {
        // Kembali ke tampilan utama (hide semua page)
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function showMaterial(materialId) {
    document.querySelectorAll('.material-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const target = document.getElementById(materialId);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.sub-bubble').forEach(bubble => {
        bubble.classList.remove('active');
        if (bubble.getAttribute('onclick').includes(materialId)) {
            bubble.classList.add('active');
        }
    });
}

// ==========================================
// QUIZ FUNCTIONS
// ==========================================

function startQuiz(level) {
    currentLevel = level;
    currentQuestions = [];
    
    const pgQuestions = questions[level].pg.map(q => ({...q, type: 'pg'}));
    const isianQuestions = questions[level].isian.map(q => ({...q, type: 'isian'}));
    
    currentQuestions = [...pgQuestions, ...isianQuestions];
    
    currentIndex = 0;
    answers = new Array(currentQuestions.length).fill(null);
    doubts = new Array(currentQuestions.length).fill(false);
    score = 0;
    
    document.getElementById('difficulty-selection').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    document.getElementById('result-area').classList.add('hidden');
    
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('question-container');
    const question = currentQuestions[currentIndex];
    
    const progress = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
    
    const btnNext = document.getElementById('btn-next');
    btnNext.textContent = currentIndex === currentQuestions.length - 1 ? 'Selesai ✓' : 'Selanjutnya →';
    
    let html = `
        <div class="question">
            <b>Soal ${currentIndex + 1} dari ${currentQuestions.length}</b>
            ${doubts[currentIndex] ? ' <span style="color: orange;">[Ragu-ragu]</span>' : ''}
            <br><br>
            ${question.q}
        </div>
    `;
    
    if (question.type === 'pg') {
        html += '<div class="options">';
        question.options.forEach((opt, idx) => {
            const selected = answers[currentIndex] === idx ? 'selected' : '';
            html += `
                <div class="option ${selected}" onclick="selectOption(${idx})">
                    ${String.fromCharCode(65 + idx)}. ${opt}
                </div>
            `;
        });
        html += '</div>';
    } else {
        const value = answers[currentIndex] || '';
        html += `
            <div style="margin-top: 20px;">
                <label><b>Jawaban:</b></label>
                <input type="text" class="input-answer" id="isian-input" value="${value}" 
                       placeholder="Masukkan jawaban..." oninput="saveIsian(this.value)">
                <small style="color: #666; display: block; margin-top: 5px;">
                    Tips: sqrt(x) untuk akar, a/b untuk pecahan
                </small>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function selectOption(index) {
    answers[currentIndex] = index;
    document.querySelectorAll('.option').forEach((opt, idx) => {
        opt.classList.toggle('selected', idx === index);
    });
}

function saveIsian(value) {
    answers[currentIndex] = value.trim().toLowerCase();
}

function markDoubt() {
    doubts[currentIndex] = !doubts[currentIndex];
    showQuestion();
}

function nextQuestion() {
    if (answers[currentIndex] === null || answers[currentIndex] === '') {
        if (!confirm('Anda belum menjawab soal ini. Yakin ingin melanjutkan?')) {
            return;
        }
    }
    
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    score = 0;
    const wrongIndices = [];
    
    currentQuestions.forEach((q, idx) => {
        if (q.type === 'pg') {
            if (answers[idx] === q.correct) {
                score += 1;
            } else {
                wrongIndices.push(idx + 1);
            }
        } else {
            const userAns = String(answers[idx] || '').replace(/\s/g, '').toLowerCase();
            const correctAns = String(q.answer).replace(/\s/g, '').toLowerCase();
            
            if (userAns === correctAns || normalizeAnswer(userAns) === normalizeAnswer(correctAns)) {
                score += 4;
            } else {
                wrongIndices.push(idx + 1);
            }
        }
    });
    
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('result-area').classList.remove('hidden');
    
    document.getElementById('final-score').textContent = score;
    
    const pgCount = questions[currentLevel].pg.length;
    const isianCount = questions[currentLevel].isian.length;
    document.getElementById('score-detail').innerHTML = `
        Level: <b>${currentLevel.toUpperCase()}</b><br>
        Total Soal: ${currentQuestions.length} (${pgCount} PG + ${isianCount} Isian)<br>
        Benar: ${currentQuestions.length - wrongIndices.length} soal<br>
        Salah: ${wrongIndices.length} soal
    `;
    
    if (wrongIndices.length > 0) {
        document.getElementById('wrong-answers').innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: rgba(244, 67, 54, 0.1); border-radius: 10px; border-left: 4px solid #f44336;">
                <b>Nomor yang salah:</b> ${wrongIndices.join(', ')}
            </div>
        `;
    } else {
        document.getElementById('wrong-answers').innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: rgba(76, 175, 80, 0.1); border-radius: 10px; border-left: 4px solid #4caf50; color: #4caf50;">
                <b>🎉 Sempurna! Semua jawaban benar!</b>
            </div>
        `;
    }
    
    generateSolutions();
}

function normalizeAnswer(ans) {
    return ans
        .replace(/sqrt\((\d+)\)/g, '√$1')
        .replace(/sqrt(\d+)/g, '√$1')
        .replace(/\^/g, '')
        .replace(/pi/g, 'π')
        .replace(/\*/g, '');
}

function generateSolutions() {
    const container = document.getElementById('solutions-container');
    let html = `<div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 212, 255, 0.1); border-radius: 10px; border-left: 4px solid var(--primary);">
        <b>Level:</b> ${currentLevel.toUpperCase()}<br>
        <small>Solusi lengkap dengan penjelasan.</small>
    </div>`;
    
    currentQuestions.forEach((q, idx) => {
        const isCorrect = (q.type === 'pg' && answers[idx] === q.correct) ||
                         (q.type === 'isian' && normalizeAnswer(String(answers[idx] || '')) === normalizeAnswer(String(q.answer)));
        
        const statusIcon = isCorrect ? '✓' : '✗';
        const statusColor = isCorrect ? '#00ff88' : '#f44336';
        
        html += `
            <div style="background: rgba(0,0,0,0.3); padding: 25px; margin-bottom: 20px; border-radius: 15px; border-left: 4px solid ${statusColor};">
                <h3 style="color: ${statusColor}; margin-bottom: 15px;">${statusIcon} Soal ${idx + 1}</h3>
                <div style="margin-bottom: 15px; opacity: 0.9;">${q.q}</div>
                
                <div style="margin-bottom: 10px;">
                    <b>Jawaban Anda:</b> 
                    <span style="color: ${isCorrect ? '#00ff88' : '#f44336'};">
                        ${answers[idx] !== null && answers[idx] !== '' ? 
                            (q.type === 'pg' ? String.fromCharCode(65 + answers[idx]) : answers[idx]) 
                            : '(tidak dijawab)'}
                    </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <b>Jawaban Benar:</b> 
                    <span style="color: #00ff88;">
                        ${q.type === 'pg' ? String.fromCharCode(65 + q.correct) + '. ' + q.options[q.correct] : q.answer}
                    </span>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-top: 15px;">
                    <b style="color: var(--primary);">💡 Penjelasan:</b><br>
                    ${q.solution}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ==========================================
// UNLOCK SOLUSI FEATURE
// ==========================================

function unlockSolutions() {
    isTryOutCompleted = true;
    updateSolusiCard();
    showPage('solusi');
    
    // Tampilkan notifikasi
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        font-family: 'Orbitron', sans-serif;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.5s ease;
        box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
    `;
    notification.innerHTML = '🔓 SOLUSI TERBUKA! Selamat mengerjakan!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function updateSolusiCard() {
    const lockOverlay = document.getElementById('lock-overlay');
    const solusiContent = document.getElementById('solusi-content');
    const solusiCard = document.getElementById('solusi-card');
    
    if (isTryOutCompleted) {
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (solusiContent) solusiContent.style.opacity = '1';
        if (solusiCard) {
            solusiCard.style.cursor = 'pointer';
            solusiCard.onclick = () => showPage('solusi');
        }
    }
}

function checkAccessSolutions() {
    if (!isTryOutCompleted) {
        // Shake animation untuk card yang terkunci
        const card = document.getElementById('solusi-card');
        card.style.animation = 'shake 0.5s';
        setTimeout(() => card.style.animation = '', 500);
        
        alert('🔒 Selesaikan TRY OUT terlebih dahulu untuk mengakses SOLUSI!');
        showPage('latihan');
    } else {
        showPage('solusi');
    }
}

// Tambahkan keyframes untuk animasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    updateSolusiCard();
    
    // Tambahkan efek parallax sederhana
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.futuristic-card');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        cards.forEach((card, index) => {
            const speed = (index + 1) * 5;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
            card.style.transform = `perspective(1000px) rotateY(${xOffset * 0.01}deg) rotateX(${-yOffset * 0.01}deg)`;
        });
    });
});