## Deploy your own

cấu hình trong file .env

# Link web, !!important, thay đổi trước khi build

# lấy đường dẫn cdn css,images....

BASE_URL='https://mshop.mediaone.dev'

# Link api

API_URL='https://mshop.mediaone.dev/api'

# Link favicon

APP_FAVICON=$BASE_URL/favicon.ico

# Default og image

ảnh mặc định
APP_IMAGE='https://www.amzdiscover.com/blog/wp-content/uploads/2018/10/free-stuff.png'

# Facebook

hiện tại chưa dùng
FACEBOOK_APP_ID="1285686478256565"
FACEBOOK_PAGE_ID="2458078334210593"

## How to use

````build
yarn build
```run
yarn start
````

## Note

Thay đổi port ở trong package.json
"start": "next start -p 4000"
