import csv
import requests
from bs4 import BeautifulSoup as bs

input = csv.reader(open("artists.csv"), delimiter=",")
header = input.next()

with open('outfile.csv', 'w') as output:
    writer = csv.writer(output, lineterminator='\n')
    writer.writerow(["id","name","gender","yearOfBirth","placeOfBirth","url","image"])
    for id,name,gender,yearOfBirth,placeOfBirth,url in input:
        print id, name, url
        req = requests.get(url)
        soup = bs(req.content, "html.parser")
        # print req.content
        figure = soup.find("figure")

        if(figure):
            noscript = figure.find("noscript")
            img = noscript.find("img")
            writer.writerow([id,name,gender,yearOfBirth,placeOfBirth,url, img.attrs[u'src']])
        else:
            writer.writerow([id,name,gender,yearOfBirth,placeOfBirth,url, ""])
