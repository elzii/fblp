# fblp

fblp, or Facebook Latest Post, is a jQuery script that parses JSON to display the most recent facebook post of a given page. It's goal is to be extremely simple to implement. It is currently a work in progress.

## Usage

- Set parent element `#fblp`.
- Include jQuery.
- Call the fblp() function, toggling console commentary with 1/0. Ex: `fblp('jQuery',1)`

```javascript
<script src="jquery.js"></script>
<script src="fblp.js"></script>
<script>
  $(document).ready(function(){
    fblp("jquery",1);
  });
</script>
```

## Notes

- CSS is within fblp.js, formatted (somewhat) readable for easy manipulation. This will be more dynamic/fluid in coming versions.
- Images are the only currently supported media type.

 