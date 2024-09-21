FROM uhub.service.ucloud.cn/entropypool_public/nginx:1.20

user root

COPY dist/spa/ /usr/share/nginx/html
COPY nginx.template.conf /etc/nginx/nginx.conf
