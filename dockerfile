# Use the official InfluxDB image
FROM influxdb:2

# Set environment variables for InfluxDB setup
ENV DOCKER_INFLUXDB_INIT_MODE=setup
ENV DOCKER_INFLUXDB_INIT_USERNAME=admin
ENV DOCKER_INFLUXDB_INIT_PASSWORD=Passw0rd
ENV DOCKER_INFLUXDB_INIT_ORG=TecEnergy
ENV DOCKER_INFLUXDB_INIT_BUCKET=Energy_Collection

# Expose InfluxDB port
EXPOSE 8086

# Command to run InfluxDB (entrypoint from the original image)
CMD ["influxd"]
