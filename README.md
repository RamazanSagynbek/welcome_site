# CHAILAT — welcome site

Ознакомительный сайт ресторана **CHAILAT kitchen & lounge** (проспект Жамбыла, 162).
Отдельный проект от QR-меню: [chailat-menu](https://github.com/RamazanSagynbek/chailat-menu).

Статический сайт без сборки: `index.html`, `style.css`, `main.js`, `i18n.js`, фото в `img/`.
Языки: қазақша (по умолчанию), русский, English. Язык можно задать ссылкой: `?lang=ru`.

## Что где менять
- **Тексты** — `i18n.js`.
- **Телефон, часы, Instagram, WhatsApp, ссылка на карту и на меню** — объект `INFO` в начале `main.js`.
- **Фото** — папка `img/`, ширина до 1500 px, JPG.

## Публикация
GitHub → Settings → Pages → Deploy from a branch → `main` / `(root)`.
