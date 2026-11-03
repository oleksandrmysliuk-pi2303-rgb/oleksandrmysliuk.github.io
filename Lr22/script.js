        // Посилання на елементи <header> та <section>
        const header = document.querySelector('header');
        const section = document.querySelector('section');
 
        // Адреса JSON
        const requestURL = 'https://semegenkep.github.io/json/example.json';
 
        // Створення та налаштування XHR-запиту
        const request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
 
        // Коли відповідь успішно отримана
        request.onload = function () {
          const superHeroes = request.response;
 
          // Для перевірки запиту: виведення об'єкта в консоль
          console.log(superHeroes);
 
          populateHeader(superHeroes);
          showHeroes(superHeroes);
        };
 
        // Якщо запит не вдався (немає мережі тощо)
        request.onerror = function () {
          const message = document.createElement('p');
          message.textContent = 'Не вдалося завантажити дані з сервера';
          header.appendChild(message);
        };
 
        // Заповнення <header>: <h1> з назвою команди та <p> з містом і роком
        function populateHeader(obj) {
          const myH1 = document.createElement('h1');
          myH1.textContent = obj.squadName;
          header.appendChild(myH1);
 
          const myPara = document.createElement('p');
          myPara.textContent = `Hometown: ${obj.homeTown} // Formed: ${obj.formed}`;
          header.appendChild(myPara);
        }
 
        // Створення карток героїв у <section>
        function showHeroes(obj) {
          const heroes = obj.members;
 
          for (const hero of heroes) {
            const myArticle = document.createElement('article');
 
            const myH2 = document.createElement('h2');
            myH2.textContent = hero.name;
 
            const myPara1 = document.createElement('p');
            myPara1.textContent = `Secret identity: ${hero.secretIdentity}`;
 
            const myPara2 = document.createElement('p');
            myPara2.textContent = `Age: ${hero.age}`;
 
            const myPara3 = document.createElement('p');
            myPara3.textContent = 'Superpowers:';
 
            const myList = document.createElement('ul');
            for (const power of hero.powers) {
              const listItem = document.createElement('li');
              listItem.textContent = power;
              myList.appendChild(listItem);
            }
 
            myArticle.appendChild(myH2);
            myArticle.appendChild(myPara1);
            myArticle.appendChild(myPara2);
            myArticle.appendChild(myPara3);
            myArticle.appendChild(myList);
 
            section.appendChild(myArticle);
          }
        }