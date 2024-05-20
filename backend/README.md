# inventory system backend


## Keywords

### View

- A view in this application is a api route that returns a json object

- I organize my api views in files called view.py


# Run the app 

## Development

In development, I use the flask devlopment server with [./run.py](./run.py)

## Production

Use the [gunicorn](https://gunicorn.org/) wsgi webserver to run the app in production.

In production i also reverse proxy the app behind a nginx server to get it on the same domain as the frontend.

## Schemas [Marshmallow](https://marshmallow.readthedocs.io/en/stable/quickstart.html)

I use marshmallow to serialize, deserialize and validate json data and it's structure.
You can define schemas that describe the structure data is supposed to have and use them to make sure the data has the right format.