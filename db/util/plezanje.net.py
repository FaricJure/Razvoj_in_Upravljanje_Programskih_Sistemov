#!/usr/bin/env python3

import os
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DB = "plezanje.net.json"
BASE_URL = "https://plezanje.net"
CRAG_XPATH = "//div[contains(@class, 'card') and contains(@class, 'ng-star-inserted') and contains(@class, 'mt-16')]"
if __name__ == "__main__":
    options = webdriver.ChromeOptions()
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--incognito")
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    country_names = [
        "slovenija",
        "italija",
        "francija",
        "hrvaska",
        "spanija",
        "avstrija",
        "grcija",
        "tajska",
        "svica",
        "zdruzene-drzave-amerike",
        "nemcija",
        "bosna-in-hercegovina",
        "crna-gora",
        "maroko",
        "juzna-afrika",
        "turcija",
        "srbija",
        "makedonija",
        "ceska",
        "slovaska",
        "svedska",
        "portugalska",
        "poljska",
    ]
    wait = WebDriverWait(driver, 240)
    if os.path.exists(DB):
        with open(DB) as f:
            countries = json.load(f)
    else:
        countries = {}

    for n in country_names:
        if n not in countries:
            print("{}/plezalisca/{}".format(BASE_URL, n))
            driver.get("{}/plezalisca/{}".format(BASE_URL, n))
            wait.until(EC.visibility_of_element_located((By.XPATH, CRAG_XPATH)))
            print("Load OK")
            crag_divs = driver.find_element(By.XPATH, CRAG_XPATH).find_elements(
                By.XPATH, "./*"
            )
            del crag_divs[0]
            countries[n] = []

            for d in crag_divs:
                crag = {}
                el = d.find_element(By.XPATH, "./*/*")
                crag["name"] = el.text
                crag["url"] = el.get_attribute("href")
                countries[n].append(crag)

    for n in country_names:
        for c in countries[n]:
            print("\tCrag: {}".format(c["url"]))
            if "sectors" in c:
                print("Skipping existing data")
                continue
            driver.get(c["url"])
            wait.until(
                EC.visibility_of_element_located((By.TAG_NAME, "app-crag-routes"))
            )
            sector_divs = driver.find_element(
                By.TAG_NAME, "app-crag-routes"
            ).find_elements(By.XPATH, "./*")
            del sector_divs[0]

            meta = driver.find_element(By.TAG_NAME, "app-crag-info").find_element(
                By.XPATH, "./*"
            )
            for m in meta.find_elements(By.XPATH, "./*"):
                el = m.find_elements(By.XPATH, "./*")
                for e in range(len(el)):
                    try:
                        if el[e].get_attribute("innerHTML") == "Koordinate":
                            raw = el[e + 1].get_attribute("innerHTML")
                            tmp = raw.split("<")
                            location = {}
                            location["longitude"] = tmp[0][1:]
                            location["latitude"] = tmp[1].split(">")[-1][1:-2]
                            c["location"] = location
                    except:
                        continue

            c["sectors"] = []
            for s in sector_divs:
                sector = {}
                sector["routes"] = []
                route_divs = []
                try:
                    if len(sector_divs) > 1:
                        ss = s.find_elements(By.XPATH, "./*")
                        sector["name"] = ss[0].text
                        print("\t\tSector: {}".format(sector["name"]))
                        route_divs = (
                            ss[1]
                            .find_elements(By.XPATH, "./*")[1]
                            .find_elements(By.XPATH, "./*")
                        )
                    elif len(sector_divs) == 1:
                        ss = sector_divs[0].find_elements(By.XPATH, "./*")
                        route_divs = (
                            ss[0]
                            .find_elements(By.XPATH, "./*")[1]
                            .find_elements(By.XPATH, "./*")
                        )
                except:
                    print("Error finding sectors")
                    continue
                for r in range(0, len(route_divs), 2):
                    rte = route_divs[r]
                    route = {}
                    rd = rte.find_elements(By.XPATH, "./*")
                    route["name"] = rd[1].text
                    print("\t\t\tRoute: {}".format(route["name"]))
                    if len(rd) == 8:
                        route["length"] = rd[2].text.split(" ")[0]
                        route["difficulty"] = rd[3].text.split("\\")[0]
                    elif len(rd) == 7:
                        route["difficulty"] = rd[2].text.split("\\")[0]
                        route["is_boulder"] = True
                    else:
                        print("Error unknown route type: Missing information")
                        continue
                    sector["routes"].append(route)
                c["sectors"].append(sector)
                with open(DB, "w") as f:
                    f.write(json.dumps(countries, indent=2))
