WHERE CAN I FLY TOMORROW — setup notes
=======================================

What's in this folder
----------------------
- index.html ............ the page itself
- netlify.toml .......... a small config file Netlify reads
- netlify/functions/wx.js  the bit that fetches the real METARs and TAFs

You don't need to open or edit any of these. Keep the folder structure
exactly as it is.


Getting it live (about five minutes, no coding)
-----------------------------------------------
1. Go to netlify.com and make a free account.
2. On your dashboard, find the "Deploy manually" / "drag and drop" area
   (Netlify calls it "Sites" > "Add new site" > "Deploy manually").
3. Drag this WHOLE folder onto it. Not the files one by one, the folder.
4. Netlify gives you a web address, something like
   musical-otter-1234.netlify.app. That's it live.
5. You can rename the site to something tidier in Site settings, or point
   your own domain at it later.
6. Link to that address from Fernando's Logbook.

To update it later, drag the folder on again. It replaces the old version.


Two honest caveats
-------------------
- The real-weather part talks to the US Aviation Weather Center's feed.
  I built it to the expected shape of that data but couldn't test it
  against the live feed from where I was working, so once it's up, send me
  what you see and I'll correct anything that reads oddly.
- Opening index.html directly on your own computer (double-clicking it)
  will show the model-only version, because the weather function only runs
  on Netlify. That's expected. It comes alive once deployed.


It always shows something
-------------------------
If the weather function can't be reached for any reason, every airfield
just falls back to the general forecast model and the page tells you so.
It never breaks, it only gets less precise.
