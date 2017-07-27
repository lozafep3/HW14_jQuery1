Презентация: http://slides.com/olegrovenskyi/deck/

=================================================

1. download https://nodejs.org/en/ and install

2. go to project folder (D:\jqueryTask>)

3 разархивируйте проект и в консоли зайдите в нее и выполните команду:

"npm install" (if use ubuntu or mac "sudo npm install")

4. run server in the project directory

"node server.js"

5. go to http://localhost:8080/

когда перейдете по http://localhost:8080/ будет подгружен ваш index.html файл

=================================================

1. С помощью ajax (jquery) получить данные из db.json

2. Сверстать форму согласно дизайну (подсказка используйте jquery можно использовать underscore или lodash)

3. Вывести данные полученные с json файла

4. Вначале перед списком продуктов идет главный заголовок для всех продуктов, данные взять из обьекта 'searchVehicle'

5. Если не получилось подгрузить данные с json вывести ошибку ("Services unavailable")

6. При нажатии на 'x', продукт должен удаляться из dom

7. При апдейте pQuantity должна менятся Total цена

8. Валидация

8.1 Если QTY = 0 вывести ошибку ('Please set QTY')

8.2 Отображать ошибку как на мокапе, над товаром.

9. При нажатии на кнопку Buy вывести в консоль спасибо за покупку