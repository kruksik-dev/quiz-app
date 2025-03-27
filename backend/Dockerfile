FROM python:3.13-alpine AS builder

WORKDIR /app

COPY /uv.lock /pyproject.toml ./

RUN pip install --no-cache-dir uv \
    && uv venv \
    && . /app/.venv/bin/activate \
    && uv sync --no-dev


FROM python:3.13-alpine

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
COPY ./src /app/src

ENV PATH="/app/.venv/bin:$PATH"
ENV VIRTUAL_ENV="/app/.venv"

EXPOSE 8000

CMD ["fastapi", "run", "src/api/main.py"]

