(function() {
    console.log('🔧 TEST: Script started!');
    
    // Простейший виджет для проверки
    const widgetHTML = `
    <div id="test-widget" style="padding: 20px; background: #007bff; color: white; border-radius: 10px; margin: 20px;">
        <h2>🎯 ТЕСТОВЫЙ ВИДЖЕТ</h2>
        <p>Если ты это видишь - скрипт работает!</p>
        <button onclick="alert('Кнопка работает!')">Нажми меня</button>
    </div>
    `;
    
    // Вставляем на страницу
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    console.log('🔧 TEST: Widget added to page');
})();