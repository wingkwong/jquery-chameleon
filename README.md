# jQuery-chameleon

Synchronizing slide images with videos 

![](https://i.imgur.com/5RYpiH5.png)

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

