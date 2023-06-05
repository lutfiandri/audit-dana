from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium import webdriver
import os.path
import time
from urllib.parse import quote
import pandas as pd


# Setup chrome options
chrome_options = Options()
# chrome_options.add_argument("--headless") # Ensure GUI is off
# chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--start-maximized')
# chrome_options.add_argument('--blink-settings=imagesEnabled=false') # error ngga mau lazy load

# Set path to chromedriver as per your configuration
homedir = os.path.expanduser("~")
webdriver_service = Service(f"{homedir}/chromedriver/113/chromedriver")


def scrape_tokopedia(product: str):
    # Choose Chrome Browser
    browser = webdriver.Chrome(
        service=webdriver_service, options=chrome_options)

    encoded_product = quote(product)

    # Navigating to Facebook
    browser.get(
        f"https://www.tokopedia.com/search?ob=23&page=3&q={encoded_product}&rf=true&st=product&shop_tier=2")

    browser.execute_script('window.scrollTo(0, 500);')
    time.sleep(1)
    browser.execute_script('window.scrollTo(0, 1500);')
    time.sleep(1)
    browser.execute_script('window.scrollTo(0, 2500);')
    time.sleep(1)

    elements = browser.find_elements(
        By.CSS_SELECTOR, '[data-testid="spnSRPProdName"]')

    # Printing the number of elements found
    print(f"Found {len(elements)} elements")

    products = post_processing_tokopedia(elements)

    browser.quit()

    return products


def get_numeric_price(text_price: str) -> int:
    numeric_string = text_price.replace("Rp", "").replace(".", "")
    numeric_value = int(numeric_string)
    return numeric_value


def post_processing_tokopedia(elements):
    products = []

    for element in elements:
        name = element.text
        parent = element.find_element(By.XPATH, "./..")

        product = {}
        product['name'] = name

        try:
            link = parent.get_attribute("href")
            product['link'] = link
        except Exception as e:
            pass

        try:

            price_element = parent.find_element(
                By.CLASS_NAME, "prd_link-product-price")
            price = get_numeric_price(price_element.text)
            product['price'] = price
        except Exception as e:
            pass

        try:
            price_original_element = parent.find_element(
                By.CLASS_NAME, "prd_label-product-slash-price")
            price_original = get_numeric_price(price_original_element.text)
            product['price_original'] = price_original

        except Exception as e:
            product['price_original'] = product['price']

        products.append(product)

    return products

    # df = pd.DataFrame(products)
    # df.head()
