// auto-rental-widget.js (исправленная версия)
(function() {
    console.log('🚗 Auto Rental Widget: Initializing...');
    
    // ТЕСТОВЫЕ ДАННЫЕ (временно)
    const TEST_CARS = [
        {
            model: "Hyundai Solaris",
            number: "A001YE02",
            year: "2021",
            color: "Белый", 
            transmission: "МКПП",
            status: "Free",
            price6: "1800",
            price7: "2100",
            photo: "https://disk.yandex.ru/9tNypaknM-4L8FQ"
        },
        {
            model: "Kia Rio",
            number: "A002YE02",
            year: "2021",
            color: "Белый",
            transmission: "АКПП", 
            status: "Free",
            price6: "2100",
            price7: "2300",
            photo: "https://disk.yandex.ru/HKUflSzczqbpCw"
        },
        {
            model: "BMW X5M", 
            number: "A666YE02",
            year: "2025",
            color: "Чёрный",
            transmission: "АКПП",
            status: "Free",
            price6: "20000",
            price7: "18000",
            photo: "https://avatars.mds.yandex.net/get-autoru-vos/2170446/3e3157f4ba2d2b6dfb5823887d51df09/1200x900n"
        }
    ];

    const TEST_KBM = [
        { license: "77АА123456", kbm: 0.46 },
        { license: "77АВ987654", kbm: 2.30 },
        { license: "78ВС111111", kbm: 1.00 }
    ];

    // Остальной код БЕЗ ИЗМЕНЕНИЙ (как в предыдущем сообщении)
    // ... 
    
    // ЗАМЕНЯЕМ функции загрузки данных:
    const checkKBM = async (license) => {
        const driver = TEST_KBM.find(item => item.license === license);
        return driver ? driver.kbm : null;
    };

    const loadCarsData = async () => {
        return TEST_CARS;
    };

    // Остальной код без изменений...
})();