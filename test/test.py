from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
options = Options()
options.add_experimental_option("detach", True)

for i in range(10): 
    driver = webdriver.Chrome(options=options)
    # Open a new tab
    driver.execute_script("window.open('');")
    # Switch to the new tab
    driver.switch_to.window(driver.window_handles[-1])
    driver.get("https://floppyfingers.online/createRoom")
    url = driver.current_url
    for i in range(9):
        # Open a new tab
        driver.execute_script("window.open('');")
        # Switch to the new tab
        driver.switch_to.window(driver.window_handles[-1])
        driver.get(url)

