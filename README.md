# jquery-chameleon

Synchronizing slide images with videos 

[![NPM version](https://img.shields.io/npm/v/jquery-chameleon.svg)](https://www.npmjs.com/package/jquery-chameleon) [![License](https://img.shields.io/npm/l/jquery-chameleon.svg)](https://github.com/wingkwong/jquery-chameleon/blob/master/LICENSE) [![Total NPM Download](https://img.shields.io/npm/dt/jquery-chameleon.svg)](https://www.npmjs.com/package/jquery-chameleon)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwingkwong%2Fjquery-chameleon.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwingkwong%2Fjquery-chameleon?ref=badge_shield)

![screenshot](https://i.imgur.com/5RYpiH5.png)

### Features
* **Video Synchronization with slide images:** 
	Synchronzing the video and slide images based on the preset rules. 
* **Markers:** 
	Showing the highlighted slide, i.e. the one you are currently viewing. Navigated to a specific moment with a simple click.
* **Responsive:** 
	Rendering in a responsive way or not is your choice.
* **Multiple Video Player Support:** 
	Currently supported video players are HTML5 player (by default), YT Player and JWPlayer 7.
* **Download Panel:** 
	Allowing users to download video, slides and transcript.

### Installing

```
npm install jquery-chameleon
```

### Getting Started
HTML:
```HTML
<div class="chameleon"></div>
```

Javascript:
```Javascript
$('.chameleon').chameleon(options);
```

### Option: 

|                    | Description                                                                         | Type          | Default | Option |
|--------------------|-------------------------------------------------------------------------------------|---------------|---------|--------|
| width              | The width of chameleon container                                                    | String        | 968px   | Y      |
| height             | The height of chameleon container                                                   | String        | 300px   | Y      |
| chameleonContext   | A JSON object or JSON file containing video player configuration and the slide info | Object/String | {}      | N      |
| numOfCarouselSlide | Number of slides shown in the carousel                                              | Number        | 5       | Y      |
| responsive         | Responsive web design with Bootstrap 3                                              | Boolean       | false   | Y      |
| player             | The video player to play the video: `html5`, `youtube`, `jwplayer`        		   | String        | html5   | N      |

### Documentation

The documentation is available at [https://wingkwong.gitbooks.io/jquery-chameleon/content/](https://wingkwong.gitbooks.io/jquery-chameleon/content/)

## Authors

* **Wing Kam WONG** -  [@wingkwong](https://github.com/wingkwong)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/wingkwong/jquery-chameleon/blob/master/LICENSE) file for details



[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwingkwong%2Fjquery-chameleon.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwingkwong%2Fjquery-chameleon?ref=badge_large)