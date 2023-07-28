import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_product_data(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    product_data = []
    for product in soup.find_all("div", {"data-component-type": "s-search-result"}):
        product_url = "https://www.amazon.in" + product.find("a", class_="a-link-normal").get("href")
        product_name = product.find("span", class_="a-size-medium").text.strip()
        product_price = product.find("span", class_="a-offscreen").text.strip()
        rating_element = product.find("span", class_="a-icon-alt")
        rating = rating_element.text.strip().split()[0] if rating_element else "N/A"
        num_reviews_element = product.find("span", {"class": "a-size-base", "dir": "auto"})
        num_reviews = num_reviews_element.text.strip() if num_reviews_element else "N/A"

        product_data.append({
            "Product URL": product_url,
            "Product Name": product_name,
            "Product Price": product_price,
            "Rating": rating,
            "Number of reviews": num_reviews
        })

    return product_data

if __name__ == "__main__":
    all_products = []
    for page_num in range(1, 51):  # Change the range to scrape more pages if needed
        url = f"https://www.amazon.in/s?k=bags&crid=2M096C61O4MLT&qid=1653308124&sprefix=ba%2Caps%2C283&ref=sr_pg_{page_num}"
        page_products = scrape_product_data(url)
        all_products.extend(page_products)

    df = pd.DataFrame(all_products)
    df.to_csv("product_data.csv", index=False)
