sandwich.js
===========

sandwich.js helps you deal with all of your .js files. It allows you to use multiple scripts during development and then will concatenate them ready for deployment. It doesn't do any minification itself, so you can choose the minification tool that best suits you. 


client-side usage
-----------------
Initially you need to include the sandwich.js file in your html via script tags. Then a second script should be included that pulls all your scripts in using sandwich's js function.

``` html
<!-- in index.html -->
<script src="sandwich.js" type="text/javascript"></script>
<script src="init.js" type="text/javascript"></script>
```


``` javascript
/* in init.js */
sandwich
  .js('js/this.js')
  .js('js/that.js');
```


server-side usage
-----------------
Server-side you need node.js to execute the concatenation code. You use the same sandwich.js (it is able to detect whether it is being run via node or not). You simply use the -f option to tell it the path to your script that calls sandwich's js function and it will do the rest. In this case we have also used '-b' which sets the base path for the script files, this is sometimes necessary when sandwich.js and html files are not in the same directory.

```
node pub/js/sandwich.js -b pub/ -f pub/js/init.js
```

The output will be printed to screen. You can then either pipe to file or to a minifier like uglify as shown below

```
node pub/js/sandwich.js -b pub/ -f pub/js/init.js | uglifyjs > output.js
```
