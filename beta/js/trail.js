function getOperatingSystem() {
    var userAgent = window.navigator.userAgent;
    var platform = window.navigator.platform;
    var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    var iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    var os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

document.addEventListener('mousemove', function(e) {
    var os = getOperatingSystem();
    if (os === 'Windows' || os === 'Mac OS' || os === 'Linux') {
        document.addEventListener('mousemove', function(e) {
            var trail = document.getElementById('trail');
            trail.style.left = e.pageX - 10 + 'px';
            trail.style.top = e.pageY - 10 + 'px';
        });
    }
});