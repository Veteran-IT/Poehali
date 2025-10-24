(function() {
    console.log('🚗 Auto Rental Widget: Starting...');
    
    // ТЕСТОВЫЕ ДАННЫЕ
    const TEST_CARS = [
        {
            model: "Hyundai Solaris",
            number: "A001YE02",
            transmission: "МКПП",
            status: "Free",
            price6: "1800",
            price7: "2100",
            photo: "https://disk.yandex.ru/9tNypaknM-4L8FQ"
        },
        {
            model: "Kia Rio", 
            number: "A002YE02",
            transmission: "АКПП",
            status: "Free", 
            price6: "2100",
            price7: "2300",
            photo: "https://disk.yandex.ru/HKUflSzczqbpCw"
        }
    ];

    // Создаём HTML
    const widgetHTML = `
    <div id="auto-rental-widget" style="font-family: Arial; max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #007bff; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">🚗 Подбор авто</h2>
        
        <div style="margin: 20px 0;">
            <h3>🔍 Проверка КБМ</h3>
            <input type="text" id="driver-license" placeholder="77АА123456" style="padding: 10px; width: 150px;">
            <button onclick="checkKBM()" style="padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 4px;">Проверить</button>
            <div id="kbm-result" style="margin-top: 10px;"></div>
        </div>

        <div id="cars-section" style="display: none;">
            <h3>🚙 Доступные авто</h3>
            <div id="cars-list"></div>
        </div>
    </div>
    `;

    // Вставляем виджет
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    console.log('🚗 Widget HTML added');

    // Глобальные функции
    window.checkKBM = function() {
        const license = document.getElementById('driver-license').value;
        const resultDiv = document.getElementById('kbm-result');
        
        if (!license) {
            resultDiv.innerHTML = '<span style="color: red;">Введите номер ВУ</span>';
            return;
        }

        // Простая проверка КБМ
        const kbm = license === '77АА123456' ? 0.46 : 
                   license === '77АВ987654' ? 2.30 : 1.00;
        
        resultDiv.innerHTML = `КБМ: ${kbm}`;
        
        // Показываем авто
        showCars(kbm);
    };

    function showCars(kbm) {
        const carsSection = document.getElementById('cars-section');
        const carsList = document.getElementById('cars-list');
        
        carsSection.style.display = 'block';
        
        // Фильтрация по КБМ
        const filteredCars = TEST_CARS.filter(car => {
            return kbm <= 1.5 || car.price6 <= 2000;
        });

        carsList.innerHTML = filteredCars.map(car => `
            <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <h4>${car.model} (${car.number})</h4>
                <p>КПП: ${car.transmission} | Цена: ${car.price6} ₽</p>
                <button onclick="selectCar('${car.number}')" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 4px;">
                    Выбрать
                </button>
            </div>
        `).join('');
    }

    window.selectCar = function(carNumber) {
        const phone = prompt('Введите телефон:');
        if (phone) {
            alert(`Спасибо! Вы выбрали ${carNumber}. Менеджер свяжется!`);
        }
    };

    console.log('🚗 Auto Rental Widget: Ready!');
})();