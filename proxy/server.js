const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const proxy = require('http-proxy-middleware');
const { routes } = require('./config.json');

app.use(morgan('dev'));
app.use('/home/:homeId', express.static(path.join(__dirname, 'public')));

// app.use('/booking/:id', proxy({ 
//   target: 'http://localhost:3004/',
//   pathRewrite: (path, req) => {
//     return path.replace('/booking', '/house');
//   }
// }));

for (route of routes) {
  app.use(route.route,
      proxy({
          target: route.address,
          pathRewrite: (path, req) => {
            return path.replace(route.source, route.reroute);
          }
      })
  );
}

// Special formatting for gallery request
app.use('/gallery/:id', proxy({ 
  target: 'http://localhost:3003/',
  pathRewrite: (path, req) => {
    return '/homes/' + path.split('/').slice(2, 3).join('') + '/images';
  }
}));

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});

// component changes for routes:

// change /house route to /booking in booking.jsx
// change /homes route to /gallery in App.js for gallery
  // take out /images from route