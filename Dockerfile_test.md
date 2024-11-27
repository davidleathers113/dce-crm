# Use the base image where the error occurs
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Optional: Print the date inside the container for debugging
RUN date -R

# Clean apt lists and caches
RUN rm -rf /var/lib/apt/lists/* && apt-get clean

# Update APT configuration to ignore future timestamps
RUN echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until

# Update APT configuration to disable pipelining
RUN echo 'Acquire::http::Pipeline-Depth "0";' > /etc/apt/apt.conf.d/99no-pipeline

# Optional: Force APT to use IPv4 (in case of IPv6 issues)
RUN echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4

# Attempt to update and install packages
RUN apt-get update && apt-get install -y --no-install-recommends build-essential

RUN sed -i 's|http://archive.ubuntu.com/ubuntu|http://ports.ubuntu.com/ubuntu-ports|g' /etc/apt/sources.list && \
    apt-get update

