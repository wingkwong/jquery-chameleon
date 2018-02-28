# Chameleon

Synchronizing slides with JWPlayer Video 

![alt text](https://raw.githubusercontent.com/wingkwong/jquery-chameleon/master/screenshot.png)

### Prerequisites

You should have a valid JW Player license key. The key is required in ChameleonContext.

### Installing

- NPM: https://www.npmjs.com/package/jquery-chameleon

## Options

|                       | Description           | Optional  |
| ----------------------|-----------------------| -----|
| width                 | The width of Chameleon container. Default: 1024px | Y |
| height                | The height of JWPlayer container. Default: 300px      |   Y |
| chameleonContext      | A JSON object or JSON file including configuration of JWPlayer and the plugin. See below for further detail.    |    N |
| numOfCarouselSlide    | Number of slides shown in the carousel. Default: 6.      |    Y |

#### ChameleonContext

|                       | Description           | Optional  |
| ----------------------|-------------| -----|
| jwplayerKey                 | The license key of JW Player. | N |
| jwplayerSetup                | JW Player setup object     |   N |
| download      | Definition of the url and the title for slides, video and transcript  |    Y |
| slides      | An array storing multiple objects defining slides info such as time, image path, title and alt text  |    N |

## Usages

HTML:
```html
<div class="chameleon"></div>
```

JavaScript:
You can either define the chameleon context with a json file
```javascript
$('.chameleon').chameleon({
  chameleonContext: 'http://dev.github.org/chameleon/context.json'
});
```
or a inline JSON object
```javascript
$(document).ready(function(){
	$('.chameleon').chameleon({
		chameleonContext: {  
		   "jwplayerKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXX" ,
		   "jwplayerSetup" : {
		   		"file": "XXXXX.xxx"
		   },
		   "download": {
		   		"slides": {
		   			"url": "xxxxxxxxxxxxxxxxxxx.xxx",
		   			"title": "this is title"
		   		},
		   		"video": {
		   			"url": "XXXXXXXXXXXXXXXXXX.xxx",
		   			"title": "this is video title"
		   		},
		   		"transcript": {
		   			"url": "xxxxx.xxx",
		   			"title": "this is transcript title"
		   		}
		   },
		   "slides":[  
		      {  
		         "time":"00:00:00",
		         "img":"https://dummyimage.com/600x400/000/fff&text=1",
		         "title": "This is a title",
	             "alt": "Dummy alt text"
		      },
		      {  
		         "time":"00:00:30",
		         "img":"https://dummyimage.com/600x400/000/fff&text=2",
		         "title": "This is a title 2"
		      },
		      {  
		         "time":"00:01:25",
		         "img":"https://dummyimage.com/600x400/000/fff&text=3",
	             "alt": "Dummy alt text"
		      },
		      {  
		         "time":"00:02:35",
		         "img":"https://dummyimage.com/600x400/000/fff&text=4"
		      }
		   ]
		}
	});
});
```

## Authors

* **Wing Kam WONG** -  [@wingkwong](https://github.com/wingkwong)


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/wingkwong/jquery-chameleon/blob/master/LICENSE) file for details

