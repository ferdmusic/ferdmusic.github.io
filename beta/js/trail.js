function getOperatingSystem() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

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
    const os = getOperatingSystem();
    if (os === 'Windows' || os === 'Mac OS' || os === 'Linux') {
        document.addEventListener('mousemove', function(e) {
            const trail = document.getElementById('trail');
            trail.style.left = e.pageX - 10 + 'px';
            trail.style.top = e.pageY - 10 + 'px';
        });
    }
});