// auto-rental-widget.js
(function() {
    console.log('🚗 Auto Rental Widget: Initializing...');
    
    // Конфигурация
    const CONFIG = {
        sheets: {
            cars: 'https://docs.google.com/spreadsheets/d/1s-jLBDPGUaUyVxZUwcDwFDAwMF68_z87hy-55ne3vnI/gviz/tq?tqx=out:json',
            kbm: 'https://docs.google.com/spreadsheets/d/1GkueFZE-K9JDB6-6VuFtPmlgzBjALqYdxZrejmsG1qM/gviz/tq?tqx=out:json&sheet=KBM'
        }
    };

    // Создаём HTML структуру
    const widgetHTML = `
    <div id="auto-rental-widget" style="font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; border: 2px solid #007bff; border-radius: 10px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff; text-align: center; margin-bottom: 30px;">🚗 Подбор авто для такси</h2>
        
        <!-- Шаг 1: Проверка КБМ -->
        <div id="step-license" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">🔍 Шаг 1: Проверка водителя</h3>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="driver-license" placeholder="77АА123456" style="padding: 12px; width: 200px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                <button id="check-kbm-btn" style="padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Проверить КБМ</button>
            </div>
            <div id="kbm-result" style="margin-top: 15px;"></div>
        </div>

        <!-- Шаг 2: Выбор тарифа (изначально скрыт) -->
        <div id="step-tariff" style="display: none; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">📅 Шаг 2: Выберите график работы</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button class="tariff-btn" data-tariff="6/1" style="padding: 20px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.3s;">
                    <div style="font-size: 24px; font-weight: bold; color: #007bff;">6/1</div>
                    <div style="margin: 10px 0;">6 дней работаете</div>
                    <div style="font-size: 12px; color: #666;">1 день отдыхаете</div>
                    <div style="font-size: 11px; margin-top: 5px; color: #28a745;">7-й день - авто бесплатно</div>
                </button>
                <button class="tariff-btn" data-tariff="7/0" style="padding: 20px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; text-align: center; transition: all 0.3s;">
                    <div style="font-size: 24px; font-weight: bold; color: #007bff;">7/0</div>
                    <div style="margin: 10px 0;">Работаете всю неделю</div>
                    <div style="font-size: 12px; color: #666;">без выходных</div>
                    <div style="font-size: 11px; margin-top: 5px; color: #28a745;">Авто всегда с вами</div>
                </button>
            </div>
        </div>

        <!-- Шаг 3: Фильтр и список авто (изначально скрыт) -->
        <div id="step-cars" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0;">🚙 Шаг 3: Выберите авто</h3>
                <select id="transmission-select" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="all">⚙️ Любая КПП</option>
                    <option value="АКПП">🔄 АКПП</option>
                    <option value="МКПП">🎛️ МКПП</option>
                </select>
            </div>
            <div id="cars-list"></div>
        </div>
    </div>
    `;

    // Вставляем виджет на страницу
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // State management
    const state = {
        kbm: null,
        cars: [],
        tariff: '6/1',
        transmission: 'all',
        currentStep: 1
    };

    // Функция показа шага
    const showStep = (step) => {
        document.getElementById('step-license').style.display = step === 1 ? 'block' : 'none';
        document.getElementById('step-tariff').style.display = step === 2 ? 'block' : 'none';
        document.getElementById('step-cars').style.display = step === 3 ? 'block' : 'none';
        state.currentStep = step;
    };

    // Функция проверки КБМ
    const checkKBM = async (license) => {
        try {
            const response = await fetch(CONFIG.sheets.kbm);
            const data = await response.text();
            const json = JSON.parse(data.substr(47).slice(0, -2));
            
            const kbmData = json.table.rows.map(row => ({
                license: row.c[0]?.v,
                kbm: row.c[1]?.v
            }));
            
            const driver = kbmData.find(item => item.license === license);
            return driver ? driver.kbm : null;
        } catch (error) {
            console.error('KBM check error:', error);
            return null;
        }
    };

    // Функция загрузки данных авто
    const loadCarsData = async () => {
        try {
            const response = await fetch(CONFIG.sheets.cars);
            const data = await response.text();
            const json = JSON.parse(data.substr(47).slice(0, -2));
            
            return json.table.rows.map(row => ({
                model: row.c[1]?.v || '',
                number: row.c[7]?.v || '',
                year: row.c[2]?.v || '',
                color: row.c[3]?.v || '',
                transmission: row.c[4]?.v === 'Да' ? 'АКПП' : 'МКПП',
                status: row.c[5]?.v || '',
                price6: row.c[8]?.v || '',
                price7: row.c[9]?.v || '',
                photo: row.c[11]?.v || ''
            }));
        } catch (error) {
            console.error('Cars data load error:', error);
            return [];
        }
    };

    // Функция рендера авто
    const renderCars = () => {
        const carsList = document.getElementById('cars-list');
        
        const filteredCars = state.cars.filter(car => {
            const transmissionMatch = state.transmission === 'all' || car.transmission === state.transmission;
            const statusMatch = car.status === 'Free' || car.status === 'Active';
            const kbmMatch = state.kbm <= 1.5 || car.price6 <= 2000;
            
            return transmissionMatch && statusMatch && kbmMatch;
        });

        if (filteredCars.length === 0) {
            carsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Нет доступных авто по выбранным критериям</div>';
            return;
        }

        carsList.innerHTML = filteredCars.map(car => `
            <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin: 15px 0; display: flex; gap: 20px; background: white; transition: transform 0.2s;">
                <img src="${car.photo}" alt="${car.model}" 
                     style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px;" 
                     onerror="this.src='https://via.placeholder.com/200x150?text=Фото+авто'">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">${car.model}</h4>
                        <div style="background: ${car.status === 'Free' ? '#28a745' : '#dc3545'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                            ${car.status === 'Free' ? 'Свободен' : 'Занят'}
                        </div>
                    </div>
                    <p style="margin: 5px 0; color: #666;">${car.number} • ${car.year} • ${car.color}</p>
                    <p style="margin: 5px 0; color: #666;">КПП: ${car.transmission}</p>
                    
                    <div style="margin: 15px 0;">
                        <div style="font-size: 24px; font-weight: bold; color: #007bff;">
                            ${state.tariff === '6/1' ? car.price6 + ' ₽' : car.price7 + ' ₽'}
                            <span style="font-size: 14px; color: #666;">/сутки</span>
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            Тариф ${state.tariff}
                        </div>
                    </div>
                    
                    <button onclick="window.selectCar('${car.number}', '${car.model}', ${state.tariff === '6/1' ? car.price6 : car.price7})" 
                            style="padding: 12px 30px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                        Выбрать
                    </button>
                </div>
            </div>
        `).join('');
    };

    // Функция выбора авто
    window.selectCar = (carNumber, carModel, price) => {
        const phone = prompt(`Вы выбрали ${carModel} (${carNumber}) за ${price} ₽/сутки\n\nВведите ваш телефон для связи:`);
        if (phone && /^[\d\s\-\+\(\)]+$/.test(phone)) {
            alert(`✅ Спасибо! Менеджер свяжется с вами по номеру ${phone} в течение 15 минут.`);
            // Здесь будет отправка в Telegram
        } else if (phone) {
            alert('❌ Пожалуйста, введите корректный номер телефона');
        }
    };

    // Инициализация
    const initWidget = async () => {
        console.log('🚗 Auto Rental Widget: Loading data...');
        
        // Загружаем данные авто
        state.cars = await loadCarsData();
        console.log('Loaded cars:', state.cars);

        // Обработчик проверки КБМ
        document.getElementById('check-kbm-btn').addEventListener('click', async () => {
            const license = document.getElementById('driver-license').value.trim();
            const kbmResult = document.getElementById('kbm-result');
            
            if (!license) {
                kbmResult.innerHTML = '<div style="color: #dc3545; padding: 10px; background: #f8d7da; border-radius: 4px;">Введите номер водительского удостоверения</div>';
                return;
            }

            kbmResult.innerHTML = '<div style="color: #856404; padding: 10px; background: #fff3cd; border-radius: 4px;">⏳ Проверяем КБМ...</div>';
            
            const kbm = await checkKBM(license);
            state.kbm = kbm;

            if (kbm === null) {
                kbmResult.innerHTML = '<div style="color: #856404; padding: 10px; background: #fff3cd; border-radius: 4px;">❓ КБМ не найден. Менеджер уточнит при звонке.</div>';
            } else if (kbm <= 0.7) {
                kbmResult.innerHTML = `<div style="color: #155724; padding: 10px; background: #d4edda; border-radius: 4px;">✅ КБМ: ${kbm}. Отличный результат! Страховка включена.</div>`;
            } else if (kbm <= 1.5) {
                kbmResult.innerHTML = `<div style="color: #856404; padding: 10px; background: #fff3cd; border-radius: 4px;">⚠️ КБМ: ${kbm}. Требуется доплата за страховку.</div>`;
            } else {
                kbmResult.innerHTML = `<div style="color: #721c24; padding: 10px; background: #f8d7da; border-radius: 4px;">❌ КБМ: ${kbm}. Доступны только авто эконом-класса.</div>`;
            }

            // Переходим к шагу 2
            showStep(2);
        });

        // Обработчики тарифов
        document.querySelectorAll('.tariff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tariff-btn').forEach(b => {
                    b.style.border = '2px solid #ddd';
                    b.style.background = 'white';
                    b.style.transform = 'scale(1)';
                });
                btn.style.border = '2px solid #007bff';
                btn.style.background = '#f0f8ff';
                btn.style.transform = 'scale(1.02)';
                
                state.tariff = btn.dataset.tariff;
                
                // Переходим к шагу 3
                showStep(3);
                renderCars();
            });
        });

        // Обработчик фильтра КПП
        document.getElementById('transmission-select').addEventListener('change', (e) => {
            state.transmission = e.target.value;
            renderCars();
        });

        console.log('🚗 Auto Rental Widget: Ready!');
    };

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();