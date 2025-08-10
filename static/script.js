const wheel = document.getElementById('wheel');
const textLabelsContainer = document.getElementById('text-labels-container');
const spinBtn = document.getElementById('spinBtn');
const resultEl = document.getElementById('resultEl');

const sections = [
    { text: 'Приз 1', color: '#ff6347' },
    { text: 'Приз 2', color: '#ffd700' },
    { text: 'Приз 3', color: '#3cb371' },
    { text: 'Приз 4', color: '#4682b4' },
    { text: 'Приз 5', color: '#9932cc' },
    { text: 'Приз 6', color: '#ff4500' },
];

const sectionAngle = 360 / sections.length;

// Функция для создания колеса и текстовых меток
function createWheel() {
    let gradientString = 'conic-gradient(';
    
    // Создаем строку для conic-gradient
    sections.forEach((section, index) => {
        const startAngle = index * sectionAngle;
        const endAngle = (index + 1) * sectionAngle;
        gradientString += `${section.color} ${startAngle}deg ${endAngle}deg${index < sections.length - 1 ? ', ' : ''}`;
        
        // Создаем и позиционируем текстовые метки
        const textEl = document.createElement('div');
        textEl.className = 'sector-text';
        textEl.textContent = section.text;
        
        // Вычисляем угол поворота для метки
        const textRotation = (index * sectionAngle) + (sectionAngle / 2);
        
        textEl.style.transform = `rotate(${textRotation}deg)`;
        
        textLabelsContainer.appendChild(textEl);
    });
    
    gradientString += ')';
    wheel.style.background = gradientString;
}

// Логика вращения
function spinWheel() {
    spinBtn.disabled = true;
    resultEl.textContent = '';
    
    // Случайный угол вращения
    const spinAngle = 360 * (3 + Math.floor(Math.random() * 3)) + (360 / sections.length) * Math.floor(Math.random() * sections.length);
    
    // Применяем вращение к колесу (секторам)
    wheel.style.transform = `rotate(${spinAngle}deg)`;
    
    // Определяем выигрыш после остановки колеса
    setTimeout(() => {
        // Нормализуем угол к диапазону 0-360, учитывая, что колесо крутится вправо
        const normalizedAngle = (360 - (spinAngle % 360));
        
        // Определяем индекс выигравшей секции
        const winningIndex = Math.floor(normalizedAngle / sectionAngle);
      
        let value = document.getElementById(winningIndex).value;
        Telegram.WebApp.sendData(value);
    
        resultEl.textContent = `🎉 Поздравляем! Вы выиграли: ${sections[winningIndex].text}`;
        console.log(winningIndex)
        spinBtn.disabled = false;
    }, 3100);
 
}

// Инициализация
createWheel();

spinBtn.addEventListener('click', spinWheel);
