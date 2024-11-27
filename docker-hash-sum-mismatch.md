# Docker Hash Sum Mismatch Error Resolution

## Problem Description
When attempting to build Docker images for the Twenty CRM project, we're encountering a "Hash Sum Mismatch" error during the package installation process. This error is occurring specifically in the Spilo Postgres image build.

### Error Message
```bash
E: Failed to fetch http://ports.ubuntu.com/ubuntu-ports/dists/jammy/main/binary-arm64/by-hash/SHA256/70a4c2132adf534c121e4a8d12ca8df455147c67f97c1c07675c09c6363dc70a  Hash Sum mismatch
```

## Context
- Environment: macOS
- Docker Version: Docker Desktop
- Project: Twenty CRM
- Specific Component: PostgreSQL database container build
- Dockerfile Location: `packages/twenty-docker/twenty-postgres-spilo/Dockerfile`

## Current Implementation
The error occurs during the execution of this command in our Dockerfile:
```dockerfile
RUN apt update && apt install default-libmysqlclient-dev -y && rm -rf /var/lib/apt/lists/*
```

## Attempted Solutions

### 1. Added APT Configuration
```dockerfile
RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom
```

### 2. Cleared Docker Build Cache
```bash
docker builder prune
```

## Research Findings
1. This is a common issue when building Docker images on macOS
2. The error occurs when the hash sum of downloaded packages doesn't match the expected hash
3. Potential causes:
   - Network issues
   - Proxy problems
   - Package repository synchronization issues
   - Caching problems
   - Incomplete downloads

## Potential Solutions Not Yet Tried
1. Using alternative package mirrors
2. Implementing retry logic in package installation
3. Using specific compression types for package lists
4. Investigating network/proxy settings
5. Upgrading Docker version

## Next Steps
1. Research more about the specific cause of hash mismatches in ARM64 architecture
2. Investigate if this is a known issue with the Spilo base image
3. Consider testing with different base images or package versions

## Related Documentation
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Spilo PostgreSQL Image Documentation](https://github.com/zalando/spilo)
- [APT Package Management Documentation](https://wiki.debian.org/Apt)

## Notes
- The error seems to be more common on ARM64 architecture (M1/M2 Macs)
- The issue might be related to the transition between different architecture support in the Ubuntu package repositories

## Project Architecture Context
- The project uses a multi-container Docker setup with several services:
  1. Main application server (twenty)
  2. PostgreSQL database using Spilo (custom PostgreSQL distribution)
  3. Redis for caching
  4. Website container

- The error occurs specifically in the Spilo PostgreSQL image build process, which:
  1. Builds mysql_fdw extension
  2. Builds libssl for wrappers
  3. Extends the base Spilo image with custom extensions

## Installation Process
- The project includes an installation script that:
  1. Checks for Docker and Docker Compose dependencies
  2. Verifies Docker is running
  3. Validates Docker Compose version (>= 2)
  4. Downloads and sets up the latest stable version

## Development Environment Details
- The error is occurring on macOS with M1/M2 (ARM64) architecture
- Docker Desktop is being used
- The project uses Docker Compose version 2+
- Base images:
  - debian:bookworm for mysql_fdw build
  - ubuntu:22.04 for libssl build
  - ghcr.io/zalando/spilo-15:3.2-p1 for final PostgreSQL image

## Error Details
During the Docker build process, the following detailed error was encountered:
```bash
0.085 WARNING: apt does not have a stable CLI interface. Use with caution in scripts.
0.085 
1.349 Get:1 http://ports.ubuntu.com/ubuntu-ports jammy InRelease [270 kB]
1.585 Get:2 http://apt.postgresql.org/pub/repos/apt jammy-pgdg InRelease [129 kB]
1.636 Get:3 http://ports.ubuntu.com/ubuntu-ports jammy-updates InRelease [128 kB]
...
6.149 Fetched 39.0 MB in 6s (6,448 kB/s)
6.149 Reading package lists...
6.373 E: Failed to fetch http://ports.ubuntu.com/ubuntu-ports/dists/jammy/main/binary-arm64/by-hash/SHA256/70a4c2132adf534c121e4a8d12ca8df455147c67f97c1c07675c09c6363dc70a  Hash Sum mismatch
6.373    Hashes of expected file:
6.373     - Filesize:1758081 [weak]
6.373     - SHA256:70a4c2132adf534c121e4a8d12ca8df455147c67f97c1c07675c09c6363dc70a
6.373     - SHA1:0775f1c36e49a9120b8177cc36dce0bb1ab9f7fb [weak]
6.373     - MD5Sum:97429aaac3beed949ce23f9e73559d13 [weak]
6.373    Hashes of received file:
6.373     - SHA256:31b5abdc469f9296994ee98458847c9874553aac6c1cdd1a28306995ee228817
6.373     - SHA1:b65e72bbacc61c7197f218de4421d0e485db4bb9 [weak]
6.373     - MD5Sum:008b9c66459539be5335c25fd8dc505e [weak]
6.373     - Filesize:1758081 [weak]
6.373    Last modification reported: Tue, 19 Apr 2022 00:52:10 +0000
6.373    Release file created at: Thu, 21 Apr 2022 17:16:08 +0000
```

## Installation Script Details
The project includes a comprehensive installation script (`packages/twenty-docker/scripts/install.sh`) that performs several important checks:

1. Docker Installation Check
```bash
if ! command -v docker &>/dev/null; then
  echo -e "\t❌ Docker is not installed or not in PATH. Please install Docker first.\n\t\tSee https://docs.docker.com/get-docker/"
  exit 1
fi
```

2. Docker Compose Plugin Check
```bash
if ! docker compose version &>/dev/null; then
  echo -e "\t❌ Docker Compose is not installed or not in PATH (n.b. docker-compose is deprecated)"
  exit 1
fi
```

3. Docker Service Status Check
```bash
if ! docker info &>/dev/null; then
  echo -e "\t❌ Docker is not running."
  exit 1
fi
```

4. Version Compatibility Checks
```bash
if [ "$(docker compose version --short | cut -d' ' -f3 | cut -d'.' -f1)" -lt 2 ]; then
  echo -e "\t❌ Docker Compose is outdated. Please update Docker Compose to version 2 or higher."
  exit 1
fi
```

5. Error Handling
```bash
set -e
function on_exit {
  local exit_status=$?
  if [ $exit_status -ne 0 ]; then
    echo "❌ Something went wrong, exiting: $exit_status"
  fi
}
trap on_exit EXIT
```
