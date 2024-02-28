# Use the official PHP image as the base image
FROM php:7.4-apache

# Copy the application files into the container
COPY . /var/www/html

# Set the working directory in the container
WORKDIR /var/www/html

# Install necessary PHP extensions
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install \
    intl \
    zip \
    && a2enmod rewrite

# Grant write permissions to the editable JSON file
RUN chown www-data:www-data /var/www/html/project_src/inputFiles/dropDownListStudents.json
RUN chmod 664 /var/www/html/project_src/inputFiles/dropDownListStudents.json

# Expose port 80
EXPOSE 80

# Define the entry point for the container
CMD ["apache2-foreground"]