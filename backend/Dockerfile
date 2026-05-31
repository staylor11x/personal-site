# Builder stage
FROM debian:bookworm-slim AS builder

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
  build-essential cmake git ca-certificates libssl-dev zlib1g-dev libjsoncpp-dev pkg-config libfmt-dev wget uuid-dev libcurl4-openssl-dev && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . /src

RUN mkdir build && cd build && cmake .. -DCMAKE_BUILD_TYPE=Release && cmake --build . -j"$(nproc)"

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y ca-certificates libstdc++6 libssl3 libjsoncpp25 && rm -rf /var/lib/apt/lists/*

RUN groupadd --system appuser && useradd --system --gid appuser appuser

WORKDIR /app
COPY --from=builder /src/build/backend ./backend
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 8080
CMD ["./backend"]
