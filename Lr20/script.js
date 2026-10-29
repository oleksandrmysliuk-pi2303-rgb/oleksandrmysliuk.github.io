  const loader = document.getElementById("loader");
        const result = document.getElementById("result");

        // Завдання 0: керування лоадером
        function showLoader() {
            loader.style.display = "block";
            result.textContent = "";
        }

        function hideLoader() {
            loader.style.display = "none";
        }

        // Завдання 1: Promise виконується через 2 секунди
        function task1() {
            showLoader();

            const promise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Hello, World!");
                }, 2000);
            });

            promise
                .then((message) => {
                    result.textContent = message;
                })
                .catch((error) => {
                    result.textContent = "Помилка: " + error;
                })
                .finally(() => {
                    hideLoader();
                });
        }

        // Завдання 2: перевірка числа
        function checkNumber(num) {
            return new Promise((resolve, reject) => {
                if (num > 10) {
                    resolve("Число більше 10");
                } else {
                    reject("Число менше або дорівнює 10");
                }
            });
        }

        function task2() {
            showLoader();

            const numbers = [15, 7, 10];
            let index = 0;

            function checkNextNumber() {
                if (index >= numbers.length) {
                    hideLoader();
                    return;
                }

                const num = numbers[index];
                result.textContent += `Перевірка числа ${num}: `;

                checkNumber(num)
                    .then((message) => {
                        result.textContent += message + "\n";
                    })
                    .catch((error) => {
                        result.textContent += error + "\n";
                    })
                    .finally(() => {
                        index++;
                        checkNextNumber();
                    });
            }

            result.style.whiteSpace = "pre-line";
            checkNextNumber();
        }