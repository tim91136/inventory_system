FROM python:3.12-slim

WORKDIR /inventory_api

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "app:create_app()","-w", "4", "-b", "0.0.0.0:5000"]