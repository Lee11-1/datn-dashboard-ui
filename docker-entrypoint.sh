#!/bin/sh
set -e

CONFDIR=/etc/nginx/conf

[ -d /etc/nginx/conf.d ] && CONFDIR=/etc/nginx/conf.d

cat <<EOF > $CONFDIR/default.conf
server {
  listen                3000;
  server_name           localhost;
  access_log            /dev/stdout;
  error_log             /dev/stderr;

  root /app/dist/spa;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location /healthcheck {
    return 200 "healthy\n";
  }

  # Media: images, icons, video, audio, HTC
  location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff2)$ {
    expires 1M;
    access_log off;
    add_header Cache-Control "public";
  }
}
EOF

# Starting nginx
exec nginx -g "daemon off;"
