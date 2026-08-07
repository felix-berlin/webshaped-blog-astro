FROM fholzer/nginx-brotli:v1.31.3

# Copy nginx configuration files into the image
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/webshaped.conf /etc/nginx/conf.d/webshaped.conf

# Base image ships its own default.conf (the "Welcome to nginx!" vhost), which
# would win as the default_server for any Host header not listed in
# webshaped.conf's server_name (e.g. a bare IP request, or a future subdomain
# not yet added there).
RUN rm -f /etc/nginx/conf.d/default.conf

# Validate syntax during build without relying on Compose DNS.
# The real upstream hostname check still happens in runtime smoke tests.
RUN cp /etc/nginx/conf.d/webshaped.conf /tmp/webshaped.conf \
	&& sed -i 's|proxy_pass http://app:4321;|proxy_pass http://127.0.0.1:4321;|' /etc/nginx/conf.d/webshaped.conf \
	&& nginx -t \
	&& mv /tmp/webshaped.conf /etc/nginx/conf.d/webshaped.conf

