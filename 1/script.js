document.addEventListener('DOMContentLoaded', async () => {
    // === Supabase Configuration ===
    const SUPABASE_URL = 'https://hykypgxaegmufdothwbv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5a3lwZ3hhZWdtdWZkb3Rod2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTE3NzMsImV4cCI6MjA3NzEyNzc3M30.Euzl2vfhHrxhgN-tfg2XftMaX9hEiJOorSJq16n2CRY';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // State
    let questions = [];
    let currentQuestionIndex = 0;
    const totalQuestions = 30; // Fixed grid size as per UI
    const questionsPerCol = 25;

    // 1. Initialize & Fetch Data
    async function init() {
        try {
            // Fetch questions from 'questions' table
            // Assuming table structure: id, content, options (json or text)
            // If table doesn't exist, this will fail and we'll handle it.
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .limit(30);

            if (error) throw error;

            if (data && data.length > 0) {
                questions = data;
                displayQuestion(0);
            } else {
                console.log("No questions found in DB, using placeholder.");
                document.getElementById('question-text').textContent = "Không tìm thấy dữ liệu câu hỏi trong bảng 'questions'.";
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
            document.getElementById('question-text').textContent = "Lỗi kết nối dữ liệu: " + err.message;
        }

        renderAnswerGrid();
    }

    // 2. Render Answer Grid (Static 1-30 structure)
    function renderAnswerGrid() {
        const tbody1 = document.getElementById('answer-body-1');
        const tbody2 = document.getElementById('answer-body-2');

        tbody1.innerHTML = '';
        tbody2.innerHTML = '';

        for (let i = 1; i <= totalQuestions; i++) {
            const row = createRow(i);
            if (i <= questionsPerCol) {
                tbody1.appendChild(row);
            } else {
                tbody2.appendChild(row);
            }
        }
    }

    function createRow(qNum) {
        const tr = document.createElement('tr');

        // Question Number Cell
        const tdNum = document.createElement('td');
        tdNum.textContent = qNum;
        tdNum.className = 'question-num';
        tr.appendChild(tdNum);

        // Options a, b, c, d
        ['a', 'b', 'c', 'd'].forEach(opt => {
            const td = document.createElement('td');
            const checkbox = document.createElement('div');
            checkbox.className = 'custom-checkbox';
            checkbox.dataset.question = qNum;
            checkbox.dataset.option = opt;

            checkbox.addEventListener('click', function () {
                // Handle Single Select logic per row
                const siblings = tr.querySelectorAll('.custom-checkbox');
                siblings.forEach(sib => sib.classList.remove('checked'));
                this.classList.add('checked');

                // Optional: Save answer to local state or DB
                console.log(`Question ${qNum} selected ${opt}`);
            });

            td.appendChild(checkbox);
            tr.appendChild(td);
        });

        return tr;
    }

    // 3. Display Question Logic
    function displayQuestion(index) {
        if (!questions[index]) return;

        const q = questions[index];
        const qTextEl = document.getElementById('question-text');

        // Display content. Assuming 'content' column exists.
        // Also checking if options are part of the content or separate.
        // For now, just dumping the content.
        qTextEl.textContent = `Câu ${index + 1}: ${q.content || q.question_text || 'Nội dung câu hỏi'}`;

        // If options are separate fields (option_a, option_b...) or a JSON array, we might want to display them below the question text
        // But the screenshot shows just a big text box.
    }

    // 4. Navigation Buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    btnPrev.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        }
    });

    // 5. Timer Logic
    let timeLeft = 58 * 60; // 58 minutes
    const countdownEl = document.getElementById('countdown');

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownEl.textContent = `${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây`;

        if (timeLeft > 0) {
            timeLeft--;
        }
    }

    setInterval(updateTimer, 1000); // Update every second for smoother feel
    updateTimer();

    // Start
    init();
});
