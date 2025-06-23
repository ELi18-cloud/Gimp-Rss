import eel
import json
import requests
import feedparser
import webbrowser
from datetime import datetime
from bs4 import BeautifulSoup
import webview
import time
# Initialize the web folder
import os
import sys
import subprocess
# This ensures the right path whether running normally or from PyInstaller
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS  # For PyInstaller
    write_base = os.path.dirname(sys.executable)
    subprocess.Popen([ "appview.exe", "http://localhost:8080"])
    unCompiled = False
else:
    base_path = os.path.dirname(__file__)
    write_base = os.path.dirname(__file__)
    subprocess.Popen(["python", "appview.py", "http://localhost:8080"])
    unCompiled = True
    
#this stores the location of the web folder for eel initialization
web_dir = os.path.join(base_path,'web')

#this stores the correct path for the presistant file rssFeed.json
rssFeedsPath = os.path.join(write_base,'rssFeed.json')
    

eel.init(web_dir)

prefs=[]
rssfeeds = {}
print('started')
#This Function makes sure that the program can correctly decode the id's back into the names
def nameUnEncode(name):
    formname = ''
    for i in name:
        if not i == '_':
            formname = formname + i
        else: 
            formname = formname + ' '
    return formname
@eel.expose
#this adds an item to the prefs list for later acess
def Newprefs(newpref):
    global prefs
    prefs.append(newpref)
    print(prefs)
#this is called to reomove a pref from the list when the user deselects something 
@eel.expose
def RemovePref(badpref):
    global prefs
    prefs.remove(badpref)
    print(prefs)
#This function gives the js the current prefs so that it can give the user dynamic suggestions by catogory 
@eel.expose
def confirmPrefs():
    global prefs
    return prefs
#This clears the pref list so that it can go from storing the data for the first selection to second
@eel.expose
def clearPrefs():
    global prefs
    prefs = []
#This stores the prefs to the computer for permanance 
@eel.expose
def commitPrefs():
    global prefs
    values = []
    path = os.path.join(base_path, 'web', 'recom.json')
    with open(path,'r') as file:
        fulllist = json.load(file)
        for item in fulllist:
            for key in prefs:
                if key in fulllist[item]:
                    buffer = {}
                    buffer[key]={
                        'RSSSource': fulllist[item][key]['RSSSource'],
                        'name' : key
                    }
                    values.append(buffer)
        print('vals',values)
    try:
        with open(rssFeedsPath, 'r') as file:
            jsondata = json.load(file)
            for i in values:
                jsondata.update(i)
    except FileNotFoundError:
        jsondata = {}
        for i in values:
            jsondata.update(i)
    with open(rssFeedsPath, 'w') as file:
        json.dump(jsondata,file,indent=4)
#this loads the prefs list (rssfeeds) into a list to prevent having to fetch it every time its needed
@eel.expose
def loadIntoMem():
    global rssfeeds
    with open(rssFeedsPath, 'r') as file:
        rssfeeds = json.load(file)
#this gives the JS the names of all of the rss feeds so it can make the sidebar buttons
@eel.expose
def sendNames():
    global rssfeeds
    names=[]
    for item in rssfeeds:
        names.append(rssfeeds[item]['name'])
    return names
#this function takes a name of an rss feed and then gets its link from the rssFeed.json and finaly fetches and parses the feed before sending it back
@eel.expose
def getRss(name):
    global rssfeeds
    formname = nameUnEncode(name)
    link = rssfeeds[formname]['RSSSource']
        # Use a User-Agent header to avoid being blocked
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/114.0.0.0 Safari/537.36"
    }
    print(link)
    rsslist = []
    response = requests.get(link, headers=headers, timeout=10)
    response.raise_for_status()  # raises error if not 2xx
    if response.status_code == 200:
        rssfeed = feedparser.parse(response.text)
        for item in rssfeed.entries:
            image = ''
            if 'media_content' in item:
                print("Image:", item.media_content[0]['url'])
                image = item.media_content[0]['url']
            # Check enclosures
            elif 'enclosures' in item and item.enclosures:
                print("Image:", item.enclosures[0]['href'])
                image = item.enclosures[0]['href']
            else:
                content = item.get('description', '') or item.get('summary', '')
                soup = BeautifulSoup(content, 'html.parser')
                img = soup.find('img')
                if img and img.has_attr('src'):
                    image = img['src']
            if image == '':
                image = 'https://wallpaperaccess.com/full/670457.jpg'
            date = ''
            if 'published_parsed' in item:
                dates = datetime(*item.published_parsed[:6])
                date = dates.astimezone().strftime('%m-%d %I:%M %p')
            elif 'updated_parsed' in item:
                dates = datetime(*item.updated_parsed[:6])
                date = dates.astimezone().strftime('%m-%d %I:%M %p')
            
            summary = BeautifulSoup(item.summary, "html.parser").get_text()
            html = f"""
            <div class="rssItem">
                <div class="abso">
                    <div class="imgleft">
                        <img src="{image}" alt="" class="imgin">
                        <a href="{item.link}" class="goto">Go To Site</a>
                    </div>
                    <h2>{item.title}</h2>
                    <h4>{date}</h4>
                    <p>{summary}</p>
                </div>
            </div> 
            """
            rsslist.append(html)
        print('recived & parsed')
        return rsslist
    else:
        print('failed')
        return ['Failure to Get RSS']\
#this just opens the link for an article in a new tab in a webbroser because if we open in the app it crashes the program
@eel.expose
def openLink(link):
    if unCompiled == True:
        subprocess.Popen(["python", "appview.py", link,'--onTop'])
    else:
        subprocess.Popen([ "appview.exe", link, '--onTop'])
        
#This is what checks if the user has already gone through the set up process
@eel.expose
def checkKnown():
    if os.path.exists(rssFeedsPath):
        print('true')
        return True
    else:
        print('false')
        return False
#this is the function that makes a new rss feed and stores it to the rssFeeds.json
@eel.expose
def newRSSFeed(name,link):
    buffer = {}
    key = name
    buffer[key] = {
        'RSSSource': link,
        'name' : key
    }
    print(buffer)
    rssFeeds = {}
    try: 
        with open(rssFeedsPath, 'r') as file:
            rssFeeds = json.load(file)
    except FileNotFoundError:
        pass
    rssFeeds.update(buffer)
    with open(rssFeedsPath, 'w') as file:
        json.dump(rssFeeds, file, indent=4)
        return True
#this is the function that allows for deleteing rss feeds 
@eel.expose
def deleteFeed(name):
    global rssfeeds
    formattedName = nameUnEncode(name)
    print(rssfeeds)
    if formattedName in rssfeeds:
        del rssfeeds[formattedName]
    with open(rssFeedsPath, 'w') as file:
        json.dump(rssfeeds, file, indent=4)     
eel.start('index.html',mode=None, port=8080)

