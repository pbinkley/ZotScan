ZoteroScan
==========

Google Apps Script to take emailed attachments and generate RIS file suitable for import into Zotero

This is script is to be deployed as a webapp with [Google Apps Script](https://developers.google.com/apps-script/). 

Use case: I'm working through a print journal, copying lots of short articles and ads with my phone (I use TurboScan). I want to import them into Zotero.

So: I email them to my Gmail account (hosted at my own domain - I haven't worked out yet whether this will work with a consumer gmail account). I enter the metadata in RIS format in the body of the email, and attach the PDF. The subject line contains "ZoteroScan", which triggers GMail to attach a label. Once I've sent a few items, I visit the webapp. It fetches all the labelled emails, uploads their attaachments to a Google Site, and gives me a script which I run on my workstation. That script downloads all the PDFs from the site, and gives me an RIS file which contains links to the downloaded PDFs. I check the RIS file and make any necessary changes, then import it into Zotero. I can then delete the emails and do more scanning.

Installation: 

* go to https://script.google.com and create a project. Copy the two files, myCode.js and myPage.html into it.
* add several project properties to the script (see the comments in myCode.js). 
* save a version and authorize it to access your apps by clicking the "Play" icon
* publish it as a webapp

Running:

* scan some items and email them to yourself with the appropriate subject line and with RIS metadata in the message body
* visit the webapp with your browser
* copy the script into your working directory and run it
* import zoteroscan.ris into Zotero

