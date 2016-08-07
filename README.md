# Gustave

## The Project

Gustave is a 6 month school project. It aim's to make your life easier.
Im a french student currently in second year or Prep'ETNA.
In the second year at this school we have to imagin and develop a free project that innovates.
Thats why I and my mates decided to develop a smart assistant which would be able to help everyone in his everyday life.

## How does it work?

Gustave is continuously listening for his keyword 'Gustave' thanks to the excellent program 'snowboy' developed by kitt.ai. (python)
When the keyword is detected Gustave launch his continuous speech recognition function :
	After the keyword is detected, Gustave begin to record chunks from microphone, these chunks are sent to a Node.js module that streams the data to the google speech API.
	Doing that, we are able to get what the user say continuously.
Once silence or no speaking for too long is detected, the last sentense recovered from the speech recognition module is sent to our intent detection module:
	Thanks to deep learning, we are able to identify the intent from the user:
	The sentense is sent to the intent module and is classied:
	ex: "who is Roger Waters?" ==> "informations"
	we call the "informations" module with the sentense "who is Roger Waters" in parameters

## What is a module?

A Gustave module is like a node module but with specific code organization:
every module give to Gustave a new feature.
The modules are located in epic_modules/custom.
In order to give the possibility to everyone to develop his own module, we had to create a custom code organization:
	every module is inside his directory ex:
		|epic_modules
		|___custom
			|____news
				|____news.js
				|____phrase.json


### news
the name of the directory has to be the same as the name of the Node.JS file

### phrase.json
	
every module has a 'phrase.json'

### news.js
this is the intelligence of the program, this is the place where you have to develop your program feature(s)


## How to add modules?