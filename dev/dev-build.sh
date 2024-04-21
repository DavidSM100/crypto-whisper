cp ./node_modules/eruda/eruda.js ./public
cp ./dev/start-eruda.js ./public

npx vite build --config ./dev/vite.config.js

rm ./public/eruda.js
rm ./public/start-eruda.js
