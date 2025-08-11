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

// Функция отправки данных в Telegram бота
function sendDataToBot(winningIndex, winningText) {
    const resultData = {
        winningIndex: winningIndex,
        winningText: winningText,
        timestamp: new Date().toISOString()
    };
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify(resultData));
        console.log('Данные отправлены в бота:', resultData);
    } else {
        console.error('Telegram WebApp API недоступен');
        console.log('Результат (без отправки):', resultData);
    }
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
        // Получаем финальный угол поворота колеса
        const finalAngle = spinAngle % 360;
        
        // Поскольку указатель находится сверху (12 часов), а колесо вращается по часовой стрелке,
        // нужно инвертировать угол для правильного определения сектора
        const adjustedAngle = (360 - finalAngle) % 360;
        
        // Вычисляем индекс выигрышного сектора
        let winningIndex = Math.floor(adjustedAngle / sectionAngle);
        
        // Дополнительная проверка и корректировка индекса
        if (winningIndex >= sections.length) {
            winningIndex = sections.length - 1;
        } else if (winningIndex < 0) {
            winningIndex = 0;
        }
        
        // Проверяем, что индекс корректный перед обращением к массиву
        if (winningIndex >= 0 && winningIndex < sections.length) {
            const winningText = sections[winningIndex].text;
            
            resultEl.textContent = `🎉 Поздравляем! Вы выиграли: ${winningText}`;
            console.log('Финальный угол:', finalAngle);
            console.log('Скорректированный угол:', adjustedAngle);
            console.log('Выигрышный индекс:', winningIndex);
            console.log('Выигрышный приз:', winningText);
            
            // Отправляем данные в бота
            sendDataToBot(winningIndex, winningText);
        } else {
            console.error('Ошибка: некорректный индекс', winningIndex);
            resultEl.textContent = 'Ошибка определения результата';
        }
        
        spinBtn.disabled = false;
    }, 3100);
}

// Инициализация
createWheel();

// Правильная регистрация обработчика события
spinBtn.addEventListener('click', spinWheel);
