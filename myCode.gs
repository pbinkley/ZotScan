function doGet() {
  var t = HtmlService.createTemplateFromFile('myPage');
  t.script = processZoteroScan();
  return t.evaluate();
}

function processZoteroScan() {
  // config - set project properties with your values
  
  // domain: your google app domain e.g. "example.com"
  var domain = ScriptProperties.getProperty('domain');
  // sitename: the name of the Google Site which you'll use to host this webapp e.g. "zoteroscan"
  var sitename = ScriptProperties.getProperty('sitename');
  // fcname: the name of the File Cabinet Page within your Site where the attachments will be hosted e.g. "ZoteroScan"
  var fcname = ScriptProperties.getProperty('fcname');
  // gmlabel: the GMail gmlabel which is assigned to the messages e.g. "ZoteroScan"
  var gmlabel = ScriptProperties.getProperty('gmlabel');
  // gmlimit: number of threads to process e.g. 100
  var gmlimit = ScriptProperties.getProperty('gmlimit');
  // localpath: the directory on your local machine where you will run the script, download the attachments, and generate the RIS file
  // e.g. /Users/me/Downloads
  var localpath = ScriptProperties.getProperty('localpath');
  
  // url of the file cabinet page
  var pageurl = "https://sites.google.com/a/" + domain + "/" + sitename + "/" + fcname;

  // prepare to add attachments to site
  var site = null;
  try {
    site = SitesApp.getSite(domain, sitename);
  }
  catch(e) {
    site = SitesApp.createSite(domain, sitename, "ZoteroScan", "ZoteroScan managment site");
  }
    
  var fileCabinet = null;
  try {
    fileCabinet = SitesApp.getPageByUrl(pageurl);
  }
  catch(e) {
    fileCabinet = site.createFileCabinetPage("ZoteroScan", "ZoteroScan", "<h1>Files</h1>")
  }
  
  var ris = "";
  var download = "#!/bin/sh\n# ZoteroScan script generated at " + Date();
  
  var conversations = GmailApp.search('label:' + gmlabel, 0, gmlimit);
  for (i in conversations) {
    var messages = conversations[i].getMessages();
    for (j in messages) {
      // individual message
      var message = messages[j];
      var messageid = message.getId();
      var subject = message.getSubject();
      download += "\n\n# Message " + messageid + ": " + subject + "\n\n";
      // strip html tags from body, retaining line breaks, and remove blank lines
      var body = message.getBody().replace(/(<(br\s?\/?)>)/ig,"\n").replace(/(<(\/div)>)/ig,"\n").replace(/(<([^>]+)>)/ig,"").replace(/^\s*$[\n\r]{1,}/gm, '');
      ris += body;
      var attachments = message.getAttachments();
      var attnum = 0;

      for (k in attachments) {
        attnum++;
        // rename with message id and attachment num prefix, to prevent clashes 
        // when two messages have attachments with same name
        var attname = messageid + "_" + attnum + "_" + attachments[k].getName();
        attachments[k].setName(attname);
        // add attachment to file cabinet
        try {
          var fcAttachment = fileCabinet.addHostedAttachment(attachments[k]);
        }
        catch(e) {
          download += "\n# " + attname + " already exists in file cabinet\n";
        }
        // add attachment entries to ris and download script
        ris += "\nL1 - file://" + localpath + "/" + encodeURIComponent(attname) + "\n";
        download += "wget " + pageurl + "/" + encodeURIComponent(attname) + "\n"
      }
      ris += "ER -\n";
    }
  }
  
  // assemble the script
  var script = download;
  script += "\n# Generate RIS file\n\ncat > zoteroscan.ris <<EOF\n";
  script += ris;
  script += "\nEOF\necho RIS file: zoteroscan.ris\n";  
  
  return script;

}

