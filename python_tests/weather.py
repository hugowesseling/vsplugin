import requests
from bs4 import BeautifulSoup

def downloadWeather(city):
    url = f"http://wttr.in/{city}?format=3"
    response = requests.get(url)
    weather_data = response.text

    soup = BeautifulSoup(weather_data, 'html.parser')
    date_element = soup.find('time')
    time_str = date_element['datetime']
    temp_element = soup.find('main')
    temperature = temp_element.text.strip()

    return {
        "city": city,
        "date": time_str,
        "temperature": temperature
    }

print(downloadWeather("Nuremberg"))