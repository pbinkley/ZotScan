ZotScan
==========

Google Apps Script to take emailed attachments and generate RIS file suitable for import into [Zotero](http://www.zotero.org/)

This is script is to be deployed as a webapp with [Google Apps Script](https://developers.google.com/apps-script/). 

Use case: I'm working through a print journal, copying lots of short articles and ads with my phone (I use [TurboScan](https://itunes.apple.com/ca/app/turboscan-quickly-scan-multipage/id342548956?mt=8) on the iPhone, or, even better, [CamScanner](https://play.google.com/store/apps/details?id=com.intsig.camscanner&hl=en) on an Android tablet). I want to import them into Zotero.

So: I email them to my Gmail account (hosted at my own domain - I haven't worked out yet whether this will work with a consumer gmail account). I enter the metadata in RIS format in the body of the email, and attach the PDF. The subject line contains "ZoteroScan", which triggers GMail to attach a label. Once I've sent a few items, I visit the webapp. It fetches all the labelled emails, uploads their attaachments to a Google Site, and gives me a script which I run on my workstation. That script downloads all the PDFs from the site, and gives me an RIS file which contains links to the downloaded PDFs. I check the RIS file and make any necessary changes, then import it into Zotero. I can then delete the emails and do more scanning.

###Installation: 

* go to https://script.google.com and create a project. Copy the two files, myCode.gs and myPage.html into it.
* add several project properties to the script (see the comments in myCode.gs). 
* save a version and authorize it to access your apps by clicking the "Play" icon
* publish it as a webapp

###Running:

* scan some items and email them to yourself with the appropriate subject line and with RIS metadata in the message body
* visit the webapp with your browser
* copy the script into your working directory and run it
* import zoteroscan.ris into Zotero

###RIS example:

This is a template I used when working through the 1936 volume of Library Journal. I would paste this into the email, then fill in the article-level fields such as author, title, issue number and date, and start page and end page. KW entries will become Zotero tags. An AB entry will become an abstract. To see what Zotero expects for different item types, try exporting an existing item as RIS.

```
TY - JOUR
AU -
TI -
T2 - Library Journal
DA - 1936/
VL - 61
IS -
KW - LJ1936
SP -
EP - 
ER -
```

###Output

The output is a shell script that downloads each PDF to the current directory using wget, and generates an RIS file with the item-level RIS from each message, augmented with an L1 link to the local copy of the PDF. It's necessary to link to a local PDF in order to get Zotero to import it, rather than just save the URL of a remote PDF.

```
# Message 13c27da1c6e5ef3e: ZoteroScan
wget https://sites.google.com/a/yourgoogleappdomain.com/zoteroscan/ZoteroScan/13c27da1c6e5ef3e_1.pdf

...

TY - JOUR
AU - 
TI - Denver Conference
T2 - Library Journal
DA - 1935/09/15/
VL - 60
IS - 16
KW - LJ1935
SP - 706
EP - 710
AB - lengthy discussion of federal aid; quotes Lydenberg
L1 - file:///Users/peterbinkley/Downloads/13c27da1c6e5ef3e_1.pdf
ER -
```
