# TodoList

This is a complete To-Do List project where you have your main "*Today*" list with the tasks of the day and you can also create multiple lists separately with different tasks.

All data is stored in the **MongoDB** database, to use it correctly you must first have MongoDB downloaded to your system and have it turned on.

In addition, you will also need to install the used libraries.
To do this, just run the command `npm i body-parser ejs express lodash mongoose`.

Then you are free to run the application in the folder where it appears. Just run `node app.js` command and then go to `localhost:3000` in your browser.

To create new lists it is necessary to create them by the url itself for now, adding `/nameNewList` to the end of `localhost:3000` where nameNewList is the name of the new list you want to create.

![alt text](https://raw.githubusercontent.com/NathSantos/TodoList/main/todolistGIF.gif)
