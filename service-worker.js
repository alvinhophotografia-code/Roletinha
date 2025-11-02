const CACHE_NAME = 'roulette-analyzer-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/styles.css',
  '/index.tsx',
  // Adicione aqui outros assets importantes que você queira cachear
  // Por exemplo, se você tivesse um logo: '/assets/logo.png'
];

// Evento de Instalação: Ocorre quando o Service Worker é registrado pela primeira vez.
self.addEventListener('install', event => {
  // O Service Worker espera até que o cache seja preenchido com os assets essenciais.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Ativação: Ocorre após a instalação e é usado para limpar caches antigos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Deleta caches que não estão na whitelist (caches de versões antigas)
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de Fetch: Intercepta todas as requisições de rede da página.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se a resposta for encontrada no cache, retorna ela.
        if (response) {
          return response;
        }

        // Se não, faz a requisição à rede.
        return fetch(event.request).then(
          response => {
            // Se a resposta da rede for inválida, apenas retorna ela.
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para poder guardá-la no cache e enviá-la ao navegador.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
