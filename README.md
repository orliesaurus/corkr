corkr
=====

Plugging the government's digital holes

#What is it?

During the Rewired State 2014 hackathon (and based on a true story pitched by @edent), the corkr team created a quick and effective way to disclose insecurities found on a large set of *.gov.uk websites.

We therefore created an interactive dashboard that lists what .gov.uk websites are insecure.  We list what vulnerabilities such websites are subject to, and then aggregate this information geographically.

Our aim is to raise awareness on web-security and the importance of maintaining websites, especially because these are government websites.

We've only found these many vulnerabilities but we're sure there are more out there.

---

### GULP STUFF

Install [node](http://nodejs.org/) & [gulp](http://gulpjs.com/)

`brew install node`, `npm install -g gulp`

Install packages

`npm i`

Build assets (only required once)

`gulp build`

Run Gulp
(Starts local server, LiveReload, SASS compilation, JS hinting & minification, image minification)

`gulp`
