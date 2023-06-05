from flask import Flask, request, jsonify
from flask_cors import CORS
import json

from utils.scrape_tokopedia import scrape_tokopedia
from utils.get_data_summary import get_data_summary

app = Flask(__name__)

CORS(app)


@app.route('/ping', methods=['GET'])
def ping():
    return 'OK'


@app.route('/scrape-products', methods=['POST'])
def post_scrape_products():
    data = request.get_json()

    # print(data)

    result_products = []

    # for product in data['products']:
    #     print(product)

    for product in data['products']:

        products = scrape_tokopedia(product['name'])

        price_data = [x['price'] for x in products]
        # print(price_data)
        data_summary = get_data_summary(price_data)

        alert_level = 0
        if product['price'] < data_summary['lower_bound'] or product['price'] > data_summary['upper_bound']:
            alert_level = 2
        elif product['price'] < data_summary['Q1'] or product['price'] > data_summary['Q3']:
            alert_level = 1

        result = {
            'name': product['name'],
            'products': products,
            'price_summary': data_summary,
            'price': product['price'],
            'alert_level': alert_level
        }

        result_products.append(result)

    return jsonify(result_products)


if __name__ == '__main__':
    app.run()
