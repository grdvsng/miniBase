/**
 * Your web Application configuration
 * @namespace
 * @const
 * @property {string} [name=MiniBase]- Name of application (will push in page title)
 * @property {string} [ico=null] - path of suit favicon
 * @property {Array.<String>} [elements=null] - name of elements than will use for application, if null will connecting all of them
 * @property {Array.<String>} pages - name of your created page in ./web.application/pages
 * @property {Array.<String>} [my_styles=null] - name of your created style in ./web.application/styles
 * @property {String} [index=null] - view will open with index page
 * @property {String} [style="default"] - application main css style.
 */
var app =
{
   "name": "MiniBase",
   "ico": "media/favicon.ico",
   "elements": null, // all, if not write, ["Element1", ...]

   // only in ./pages
   "pages":
   [
       "index_page",
       "search_user_page",
       "push_user_page"
   ],

   // if user should past style in "./styles" , in Array push only file name
   "my_styles":
   [
       "main"
   ],

   "index": "index_page",
   "style": "default",
}