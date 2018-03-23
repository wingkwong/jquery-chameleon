# jQuery-chameleon

Synchronizing slide images with videos 

![](https://i.imgur.com/5RYpiH5.png)

### Installing

- NPM: https://www.npmjs.com/package/jquery-chameleon

### Supported Players

- HTML5 (Default) 
- Youtube 
- JWPlayer 7

## Usages

HTML:
```html
<div class="chameleon"></div>
```


#### Options

|                    | Description                                                                         | Type          | Default | Option |
|--------------------|-------------------------------------------------------------------------------------|---------------|---------|--------|
| width              | The width of chameleon container                                                    | String        | 968px   | Y      |
| height             | The height of chameleon container                                                   | String        | 300px   | Y      |
| chameleonContext   | A JSON object or JSON file containing video player configuration and the slide info | Object/String | {}      | N      |
| numOfCarouselSlide | Number of slides shown in the carousel                                              | Number        | 5       | Y      |
| responsive         | Responsive web design with Bootstrap 3                                              | Boolean       | false   | Y      |
| player             | The video player to play the video: `html5`, `youtube`, `jwplayer`        		   | String        | html5   | N      |


#### chameleonContext

|               | Description                   | Type   | Optional |
|---------------|-------------------------------|--------|----------|
| jwplayerSetup | JW Player options object      | Object | N        |
| html5Setup    | HTML 5 Player options object  | Object | N        |
| youtubeSetup  | Youtube Player options object | Object | N        |
| download      | Download Panel                | Object | N        |
| slides        | Slides info                   | Array  | Y        |

#### jwplayerSetup

Please refer to [JW Player Configuration Reference](https://developer.jwplayer.com/jw-player/docs/developer-guide/customization/configuration-reference/)

#### html5Setup

|         | Description                                 | Type           | Optional |
|---------|---------------------------------------------|----------------|----------|
| sources | Definition(s) of the video URL and its type | Object / Array | N        |
| poster  | A poster image path                         | String         | Y        |

The sources can be a single object:
```javascript
{
	"html5Setup" :{
      "sources": [
         {
            "file": "https://goo.gl/oAaZNs",
            "type": "video/mp4"
         }
      ]
   }
}
```

Or it can be an array with multiple objects
```javascript
{
	"html5Setup" :{
		"sources": [
			{
				"file": "https://goo.gl/oAaZNs",
				"type": "video/mp4"
			},
			{
				"file": "https://goo.gl/oAaZNs",
				"type": "video/mp4"
			},
			{
				"file": "https://goo.gl/oAaZNs",
				"type": "video/mp4"
			}
		]
	}
}
```


#### youtubeSetup

|         | Description                 | Type   | Optional |
|---------|-----------------------------|--------|----------|
| videoId | The ID of the Youtube video | String | N        |

```javascript
{
	"youtubeSetup": {
		"videoId": "FlsCjmMhFmw"
	}
}
```

#### download

|               | Description                                                    | Type   | Optional | Attributes   |
|---------------|----------------------------------------------------------------|--------|----------|--------------|
| slides        | A object containing attributes url and title for slides        | Object | Y        | `url` `title` |
| video         | A object containing attributes url and title for video         | Object | Y        | `url` `title` |
| transcript    | A object containing attributes url and title for transcription | Object | Y        | `url` `title` |



```javascript
{
	"download": {
		"slides": {
			"url": "https://dummy.gk/wIngKwoNg",
			"title": "Download Slides"
		},
		"video": {
			"url": "https://goo.gl/oAaZNs",
			"title": "Download Video"
		},
		"transcript": {
			"url": "https://goo.gl/swiAnf",
			"title": "Download Transcript"
		}
	}
}
```

#### slides

|       | Description                                      | Type   | Optional |
|-------|--------------------------------------------------|--------|----------|
| time  | The starting time of the slide. Format: hh:mm:ss | String | N        |
| img   | The URL of the slide image                       | String | N        |
| title | The title of the slide image                     | String | Y        |
| alt   | The alt text of the slide image                  | String | Y        |

```javascript
{
	"slides":[  
		{  
		 "time":"00:00:00",
		 "img":"https://dummyimage.com/600x400/000/fff&text=1",
		},
		{  
		 "time":"00:00:02",
		 "title": "Ultricies nec, pellentesque eu",
		 "img":"https://dummyimage.com/600x400/000/fff&text=2"
		},
		{  
		 "time":"00:00:05",
		 "title": "Augue velit cursus nunc",
		 "img":"https://dummyimage.com/600x400/000/fff&text=3"
		},
		{  
		 "time":"00:00:08",
		 "title": "Donec quam felis,",
		 "img":"https://dummyimage.com/600x400/000/fff&text=4",
		 "alt": "Donec quam felis"
		}
	]
}
```


## Authors

* **Wing Kam WONG** -  [@wingkwong](https://github.com/wingkwong)

## Changelog

- 1.1 
	- Introduced Responsive feature
	- Added HTML5 and Youtube to Player options
	- Added Marker info
	- Revised theme style

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/wingkwong/jquery-chameleon/blob/master/LICENSE) file for details

