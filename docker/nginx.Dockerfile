FROM fholzer/nginx-brotli:v1.30.0

# Copy nginx configuration files into the image
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/webshaped.conf /etc/nginx/conf.d/webshaped.conf

# Validate configuration on build
RUN nginx -t

# Default command (inherited from base image)
CMD ["nginx", "-g", "daemon off;"]
